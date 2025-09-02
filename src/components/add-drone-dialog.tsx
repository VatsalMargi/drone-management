// File: src/components/add-drone-dialog.tsx
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { addDrone } from '@/app/actions';
import { toast } from 'sonner';

export default function AddDroneDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async (formData: FormData) => {
    await addDrone(formData);
    setIsOpen(false); // Close the dialog on success
    toast.success('Drone added successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Drone</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleAction}>
          <DialogHeader>
            <DialogTitle>Add New Drone</DialogTitle>
            <DialogDescription>
              Enter the details for the new drone to add it to your fleet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">Model</Label>
              <Input id="model" name="model" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Drone</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}