// File: src/components/mission-monitor.tsx (Corrected)

'use client';

import { Mission, Drone } from '@prisma/client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { abortMission, pauseMission, resumeMission } from '@/app/actions';

// Dynamically import the map to avoid SSR issues
const LiveMissionMap = dynamic(() => import('./live-mission-map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-200 animate-pulse rounded-md" />,
});

// FIX 1: Define a new type for the mission state that includes our dynamic properties.
// These properties are optional because they only exist during live monitoring.
type MonitoredMission = Mission & { 
  drone: Drone | null;
  progress?: number;
  currentPosition?: { lat: number, lon: number };
};

// FIX 2: Update the props interface to use our new, more accurate type.
interface MissionMonitorProps {
  initialMission: MonitoredMission;
}

export default function MissionMonitor({ initialMission }: MissionMonitorProps) {
  // FIX 3: Explicitly type the useState hook with our new type.
  const [mission, setMission] = useState<MonitoredMission>(initialMission);

  // Poll for status updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      // Don't poll if the mission is already finished
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mission Monitor: {mission.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* This will now be type-safe */}
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
                <form action={abortMission}>
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