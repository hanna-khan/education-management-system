"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchoolEvents } from "@/hooks/use-school-events";
import type { EventTone, SchoolEventType } from "@/mock/events";

const EVENT_TYPES: SchoolEventType[] = [
  "Competition", "Meeting", "Tour", "Sports", "Cultural", "Exam", "Holiday", "Concert", "Reception",
];

const EVENT_TONES: EventTone[] = ["purple", "teal", "orange", "coral", "blue", "green"];

export function CreateEventDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addEvent } = useSchoolEvents();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00 AM - 12:00 PM");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<SchoolEventType>("Meeting");
  const [tone, setTone] = useState<EventTone>("purple");
  const [capacity, setCapacity] = useState("200");

  const reset = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("09:00 AM - 12:00 PM");
    setLocation("");
    setType("Meeting");
    setTone("purple");
    setCapacity("200");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) return;

    addEvent({
      title,
      description: description || `School event: ${title}`,
      date,
      time,
      location,
      type,
      tone,
      capacity: parseInt(capacity, 10) || 200,
      sold: 0,
      campus: "Main Campus",
      participants: [],
    });

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create School Event</DialogTitle>
          <DialogDescription>
            New events appear on all portal dashboards and the school calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Event title</Label>
            <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Annual Science Fair" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-desc">Description</Label>
            <Input id="event-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input id="event-time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input id="event-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Main Auditorium" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as SchoolEventType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as EventTone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_TONES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-capacity">Capacity</Label>
              <Input id="event-capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} min={1} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
