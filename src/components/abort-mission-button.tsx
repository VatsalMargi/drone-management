// File: src/components/abort-mission-button.tsx
'use client';

import { abortMission } from "@/app/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function AbortMissionButton({ droneId }: { droneId: string }) {
  const handleAction = async (formData: FormData) => {
    const result = await abortMission(formData);
    if (result.success) {
      toast.success("Mission aborted successfully.");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form action={handleAction}>
      <input type="hidden" name="droneId" value={droneId} />
      <Button type="submit" variant="destructive" size="sm">
        Abort
      </Button>
    </form>
  );
}