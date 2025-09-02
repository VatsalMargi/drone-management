// File: src/app/page.tsx

import prisma from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AddDroneDialog from "@/components/add-drone-dialog";
import AbortMissionButton from '@/components/abort-mission-button';

// Helper to style the status badges
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return 'default';
    case 'IN_MISSION':
      return 'secondary';
    case 'MAINTENANCE':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default async function Home() {
  // Fetch all drones directly from the database
  const drones = await prisma.drone.findMany({
    orderBy: { name: 'asc' },
    include: {
      currentMission: true,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fleet Management Dashboard</h1>
      <AddDroneDialog/>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[200px]">Battery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drones.map((drone) => (
              <TableRow key={drone.id}>
                <TableCell className="font-medium">{drone.name}</TableCell>
                <TableCell>{drone.model}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(drone.status)}>
                    {drone.status}
                  </Badge>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                     <Progress value={drone.batteryLevel} className="w-[60%]" />
                     <span>{drone.batteryLevel}%</span>
                   </div>
                </TableCell>
                <TableCell> {/* <-- 4. Add Actions cell */}
                  {drone.status === 'IN_MISSION' && drone.currentMission && (
                    <AbortMissionButton droneId={drone.id} />
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