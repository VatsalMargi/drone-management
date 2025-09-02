// File: src/components/mission-monitor.tsx (Final Corrected Version)

'use client';

import { Mission, Drone } from '@prisma/client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { abortMission, pauseMission, resumeMission } from '@/app/actions';
import { toast } from 'sonner'; // Ensure toast is imported

// Dynamically import the map to avoid SSR issues
const LiveMissionMap = dynamic(() => import('./live-mission-map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-200 animate-pulse rounded-md" />,
});

type MonitoredMission = Mission & { 
  drone: Drone | null;
  progress?: number;
  currentPosition?: { lat: number, lon: number };
};

interface MissionMonitorProps {
  initialMission: MonitoredMission;
}

export default function MissionMonitor({ initialMission }: MissionMonitorProps) {
  const [mission, setMission] = useState<MonitoredMission>(initialMission);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (mission.status === 'COMPLETED' || mission.status === 'ABORTED') {
        clearInterval(interval);
        return;
      }

      const res = await fetch(`/api/missions/${mission.id}/status`);
      const data = await res.json();
      setMission((prev) => ({ ...prev, ...data }));

      if (data.status === 'COMPLETED' || data.status === 'ABORTED') {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [mission.id, mission.status]);

  // FIX 1: Create a client-side wrapper function to handle the abort action.
  // This function can call the server action and then use the return value
  // to show a client-side notification.
  const handleAbortAction = async (formData: FormData) => {
    const result = await abortMission(formData);
    if (result.success) {
      toast.success("Mission aborted successfully.");
    } else {
      toast.error(result.error || "Failed to abort mission.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mission Monitor: {mission.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <LiveMissionMap flightPath={mission.flightPath} currentPosition={mission.currentPosition} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Mission Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Status</p>
              <Badge>{mission.status}</Badge>
            </div>
            <div>
              <p className="font-semibold">Drone</p>
              <p>{mission.drone?.name}</p>
            </div>
            <div>
              <p className="font-semibold">Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={mission.progress || 0} />
                <span>{mission.progress || 0}%</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {mission.status === 'IN_PROGRESS' && (
                <form action={pauseMission}>
                  <input type="hidden" name="missionId" value={mission.id} />
                  <Button type="submit" variant="secondary">Pause</Button>
                </form>
              )}
               {mission.status === 'PAUSED' && (
                <form action={resumeMission}>
                  <input type="hidden" name="missionId" value={mission.id} />
                  <Button type="submit">Resume</Button>
                </form>
              )}
              {(mission.status === 'IN_PROGRESS' || mission.status === 'PAUSED') && (
                // FIX 2: Pass the new wrapper function to the form's action prop.
                <form action={handleAbortAction}>
                   <input type="hidden" name="droneId" value={mission.droneId!} />
                   <Button type="submit" variant="destructive">Abort</Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}