// File: src/app/missions/new/actions.ts (Corrected)
'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// The type for our form's state
interface FormState {
  error: string;
}

// FIX: Update the function to accept previousState as the first argument
export async function createMission(previousState: FormState, formData: FormData): Promise<FormState> {
  const flightPathData = formData.get('flightPath') as string;

  if (!flightPathData || flightPathData === 'null') {
    return { error: 'Flight path is required. Please draw a survey area on the map.' };
  }

  // We'll update the selected drone's status in a transaction
  const selectedDroneId = formData.get('droneId') as string;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create the new mission
      await tx.mission.create({
        data: {
          name: formData.get('name') as string,
          flightAltitude: Number(formData.get('altitude')),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          surveyPattern: formData.get('pattern') as any, // GRID, CROSSHATCH, PERIMETER
          droneId: selectedDroneId,
          flightPath: JSON.parse(flightPathData),
        },
      });

      // 2. Update the drone's status to IN_MISSION
      await tx.drone.update({
        where: { id: selectedDroneId },
        data: { status: 'IN_MISSION' },
      });
    });
  } catch (error) {
    console.error("Failed to create mission:", error);
    return { error: 'Failed to create mission. The selected drone might already be in a mission.' };
  }

  // On success, we handle redirection. We don't need to return a state.
  // The hook will not update the state if the component redirects.
  revalidatePath('/'); // Revalidate the dashboard page to show the updated drone status
  redirect('/'); // Redirect back to the dashboard
}