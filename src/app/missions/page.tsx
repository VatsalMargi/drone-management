// File: src/app/missions/page.tsx

import prisma from '@/lib/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissionStatus } from '@prisma/client';
import { startMission } from '../actions';
import Link from 'next/link';

// Helper to style the status badges based on mission status
const getStatusVariant = (status: MissionStatus) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'secondary';
    case 'COMPLETED':
      return 'default'; // default is green-ish for success
    case 'ABORTED':
      return 'destructive';
    case 'PLANNED':
    default:
      return 'outline';
  }
};

export default async function MissionsPage() {
  // Fetch all missions, including the name of the drone assigned to each
  const missions = await prisma.mission.findMany({
    orderBy: { createdAt: 'desc' }, // Show the newest missions first
    include: {
      drone: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Missions</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Drone</TableHead>
              <TableHead>Altitude</TableHead>
              <TableHead>Pattern</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(mission.status)}>
                    {mission.status}
                  </Badge>
                </TableCell>
                <TableCell>{mission.drone?.name ?? 'Unassigned'}</TableCell>
                <TableCell>{mission.flightAltitude}m</TableCell>
                <TableCell>{mission.surveyPattern}</TableCell>
                <TableCell>
                  {new Date(mission.createdAt).toLocaleString()}
                </TableCell>
                <TableCell> {/* Add Actions Cell */}
                  {mission.status === 'PLANNED' && (
                    <form action={startMission}>
                      <input type="hidden" name="missionId" value={mission.id} />
                      <Button type="submit" size="sm">Start</Button>
                    </form>
                  )}
                  {(mission.status === 'IN_PROGRESS' || mission.status === 'PAUSED') && (
                     <Button asChild size="sm" variant="secondary">
                       <Link href={`/missions/${mission.id}/monitor`}>Monitor</Link>
                     </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}