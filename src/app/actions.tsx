// File: src/app/actions.ts
'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addDrone(formData: FormData) {
  const name = formData.get('name') as string;
  const model = formData.get('model') as string;

  // Since we removed authentication, we'll find the first organization
  // and assign the new drone to it. In a real app, this would come from the user's session.
  const firstOrg = await prisma.organization.findFirst();

  if (!firstOrg) {
    throw new Error('No organization found. Please seed the database first.');
  }

  await prisma.drone.create({
    data: {
      name,
      model,
      organizationId: firstOrg.id,
    },
  });

  // Refresh the data on the dashboard
  revalidatePath('/');
}

export async function abortMission(formData: FormData) {
    const droneId = formData.get('droneId') as string;
  
    if (!droneId) {
      throw new Error('Drone ID is required to abort a mission.');
    }
  
    try {
      await prisma.$transaction(async (tx) => {
        // Find the mission this drone is on
        const mission = await tx.mission.findFirst({
          where: { droneId: droneId, status: 'IN_PROGRESS' },
        });
  
        if (!mission) {
          throw new Error('No active mission found for this drone.');
        }
  
        // 1. Update the mission status to ABORTED
        await tx.mission.update({
          where: { id: mission.id },
          data: { status: 'ABORTED' },
        });
  
        // 2. Update the drone status back to AVAILABLE
        await tx.drone.update({
          where: { id: droneId },
          data: { status: 'AVAILABLE' },
        });
      });
  
      revalidatePath('/'); // Refresh the dashboard
      return { success: true };
    } catch (error) {
      console.error('Failed to abort mission:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  export async function startMission(formData: FormData) {
    const missionId = formData.get('missionId') as string;
    await prisma.mission.update({
      where: { id: missionId },
      data: { status: 'IN_PROGRESS' },
    });
    revalidatePath('/missions');
    redirect(`/missions/${missionId}/monitor`);
  }
  
  export async function pauseMission(formData: FormData) {
    const missionId = formData.get('missionId') as string;
    await prisma.mission.update({
      where: { id: missionId },
      data: { status: 'PAUSED' },
    });
    revalidatePath(`/missions/${missionId}/monitor`);
  }
  
  export async function resumeMission(formData: FormData) {
    const missionId = formData.get('missionId') as string;
    await prisma.mission.update({
      where: { id: missionId },
      data: { status: 'IN_PROGRESS' },
    });
    revalidatePath(`/missions/${missionId}/monitor`);
  }