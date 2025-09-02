// File: src/app/missions/new/_components/mission-form.tsx (Corrected)

'use client';

import { useEffect } from 'react';
// FIX 1: Import `useActionState` from `react` instead of `useFormState` from `react-dom`
import { useActionState } from 'react';
import { Drone, SurveyPattern } from '@prisma/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMissionStore } from './store';
import { createMission } from '../actions';
import { toast } from 'sonner';

interface MissionFormProps {
  drones: Drone[];
}

// The initial state for the action remains the same
const initialState = { error: '' };

export default function MissionForm({ drones }: MissionFormProps) {
  const flightPath = useMissionStore((state) => state.flightPath);
  
  // FIX 2: Use the renamed hook `useActionState`
  const [state, formAction] = useActionState(createMission, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);


  return (
    <form action={formAction} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Mission Configuration</h2>

      {/* Hidden input to store the flight path data */}
      <input type="hidden" name="flightPath" value={JSON.stringify(flightPath)} />

      <div className="space-y-2">
        <Label htmlFor="name">Mission Name</Label>
        <Input id="name" name="name" placeholder="e.g., Site A Inspection" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="altitude">Flight Altitude (meters)</Label>
        <Input id="altitude" name="altitude" type="number" placeholder="90" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pattern">Survey Pattern</Label>
        <Select name="pattern" required>
          <SelectTrigger id="pattern">
            <SelectValue placeholder="Select a pattern" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SurveyPattern).map((pattern) => (
              <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="droneId">Assign Drone</Label>
        <Select name="droneId" required>
          <SelectTrigger id="droneId">
            <SelectValue placeholder="Select an available drone" />
          </SelectTrigger>
          <SelectContent>
            {drones.map((drone) => (
              <SelectItem key={drone.id} value={drone.id}>{drone.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={!flightPath}>
        Create Mission
      </Button>

      {!flightPath && (
        <p className="text-sm text-center text-red-500 pt-2">
          Please draw a survey area on the map to enable mission creation.
        </p>
      )}
    </form>
  );
}