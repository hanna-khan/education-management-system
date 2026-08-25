"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/shared/toast";

export type MockField =
  | {
      name: string;
      label: string;
      type?: "text" | "email" | "tel" | "number" | "date" | "textarea";
      placeholder?: string;
      required?: boolean;
      defaultValue?: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
      defaultValue?: string;
    };

interface MockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: MockField[];
  submitLabel?: string;
  successMessage?: string;
}

export function MockFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  submitLabel = "Save",
  successMessage,
}: MockFormDialogProps) {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])),
  );

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) return;
    }
    toast(successMessage ?? `${title} saved successfully (demo).`);
    onOpenChange(false);
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required ? <span className="text-[var(--error)]"> *</span> : null}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={values[field.name] || undefined}
                  onValueChange={(v) => setValue(field.name, v)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  className="min-h-[88px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder={field.placeholder}
                  required={field.required}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface MockActionButtonProps {
  label: string;
  title?: string;
  description?: string;
  fields?: MockField[];
  submitLabel?: string;
  successMessage?: string;
  /** Simple confirm (no form fields) */
  confirmOnly?: boolean;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
}

/** Button that opens a mock create/edit dialog (or confirm) and shows a success toast. */
export function MockActionButton({
  label,
  title,
  description = "This is a demo action. Data is not persisted yet.",
  fields,
  submitLabel,
  successMessage,
  confirmOnly = false,
  variant,
  size = "sm",
  className,
  children,
  icon,
}: MockActionButtonProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const dialogTitle = title ?? label;
  const defaultFields: MockField[] = fields ?? [
    { name: "name", label: "Name", required: true, placeholder: "Enter name" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional notes" },
  ];

  if (confirmOnly) {
    return (
      <>
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className}
          onClick={() => setOpen(true)}
        >
          {icon}
          {children ?? label}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  toast(successMessage ?? `${dialogTitle} completed (demo).`);
                  setOpen(false);
                }}
              >
                {submitLabel ?? "Confirm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {icon}
        {children ?? label}
      </Button>
      <MockFormDialog
        open={open}
        onOpenChange={setOpen}
        title={dialogTitle}
        description={description}
        fields={defaultFields}
        submitLabel={submitLabel ?? "Save"}
        successMessage={successMessage ?? `${dialogTitle} saved successfully (demo).`}
      />
    </>
  );
}

/** Instant toast action (export/download/etc.) */
export function MockToastButton({
  label,
  message,
  variant = "outline",
  size = "sm",
  className,
  icon,
  children,
}: {
  label: string;
  message?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const { toast } = useToast();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => toast(message ?? `${label} completed (demo).`)}
    >
      {icon}
      {children ?? label}
    </Button>
  );
}

/** Common field presets for school EMS mock forms */
export const MOCK_FORMS = {
  department: [
    { name: "name", label: "Department name", required: true, placeholder: "Computer Science" },
    { name: "code", label: "Code", required: true, placeholder: "CS" },
    { name: "hod", label: "Head of department", placeholder: "Dr. Name" },
  ] as MockField[],
  program: [
    { name: "name", label: "Program name", required: true, placeholder: "BS Computer Science" },
    { name: "department", label: "Department", type: "select", options: ["Computer Science", "Electrical Engineering", "Business", "Humanities"], required: true },
    { name: "type", label: "Type", type: "select", options: ["undergraduate", "graduate"], required: true },
    { name: "duration", label: "Duration (years)", type: "number", defaultValue: "4" },
  ] as MockField[],
  course: [
    { name: "code", label: "Course code", required: true, placeholder: "CS-401" },
    { name: "name", label: "Course name", required: true, placeholder: "Algorithms" },
    { name: "department", label: "Department", type: "select", options: ["Computer Science", "Electrical Engineering", "Business", "Humanities"], required: true },
    { name: "credits", label: "Credits", type: "number", defaultValue: "3" },
    { name: "instructor", label: "Instructor", placeholder: "Faculty name" },
  ] as MockField[],
  section: [
    { name: "course", label: "Course", required: true, placeholder: "CS-401" },
    { name: "section", label: "Section", required: true, placeholder: "A" },
    { name: "teacher", label: "Teacher", required: true },
    { name: "room", label: "Room", placeholder: "Block A-201" },
    { name: "schedule", label: "Schedule", placeholder: "Mon/Wed 10:00–11:30" },
  ] as MockField[],
  admission: [
    { name: "name", label: "Applicant name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "program", label: "Program", type: "select", options: ["BS Computer Science", "BS Electrical Engineering", "BBA", "MBA"], required: true },
    { name: "cycle", label: "Cycle", type: "select", options: ["Fall 2026", "Spring 2027"], required: true },
    { name: "notes", label: "Notes", type: "textarea" },
  ] as MockField[],
  workflow: [
    { name: "name", label: "Workflow name", required: true, placeholder: "Leave approval" },
    { name: "trigger", label: "Trigger", type: "select", options: ["Leave request", "Fee waiver", "Document request", "Complaint"], required: true },
    { name: "steps", label: "Approval steps", type: "textarea", placeholder: "Teacher → HOD → Principal", required: true },
  ] as MockField[],
  student: [
    { name: "firstName", label: "First name", required: true },
    { name: "lastName", label: "Last name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "program", label: "Program", required: true },
    { name: "department", label: "Department", required: true },
    { name: "semester", label: "Semester", type: "number", defaultValue: "1" },
  ] as MockField[],
  employee: [
    { name: "name", label: "Full name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "department", label: "Department", required: true },
    { name: "designation", label: "Designation", required: true },
    { name: "joinDate", label: "Join date", type: "date" },
  ] as MockField[],
  notice: [
    { name: "title", label: "Title", required: true },
    { name: "audience", label: "Audience", type: "select", options: ["All", "Students", "Teachers", "Parents"], required: true },
    { name: "body", label: "Message", type: "textarea", required: true },
    { name: "expiry", label: "Expiry date", type: "date" },
  ] as MockField[],
  application: [
    { name: "type", label: "Application type", type: "select", options: ["Leave", "Scholarship", "Certificate", "Fee installment", "Other"], required: true },
    { name: "subject", label: "Subject", required: true },
    { name: "details", label: "Details", type: "textarea", required: true },
  ] as MockField[],
  exam: [
    { name: "course", label: "Course", required: true },
    { name: "type", label: "Exam type", type: "select", options: ["Quiz", "Midterm", "Final", "Lab"], required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "time", label: "Time", placeholder: "09:00 AM" },
    { name: "room", label: "Room", placeholder: "Hall A" },
  ] as MockField[],
  invoice: [
    { name: "student", label: "Student ID / name", required: true },
    { name: "semester", label: "Semester", required: true },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "dueDate", label: "Due date", type: "date" },
  ] as MockField[],
  payment: [
    { name: "student", label: "Student", required: true },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "method", label: "Method", type: "select", options: ["Cash", "Bank transfer", "Card", "Online"], required: true },
    { name: "reference", label: "Reference", placeholder: "Receipt / txn ID" },
  ] as MockField[],
  document: [
    { name: "name", label: "Document name", required: true },
    { name: "type", label: "Type", type: "select", options: ["Certificate", "ID", "Transcript", "Resume", "Other"], required: true },
    { name: "file", label: "File name (demo)", placeholder: "document.pdf", required: true },
  ] as MockField[],
  leave: [
    { name: "type", label: "Leave type", type: "select", options: ["Casual", "Sick", "Annual", "Emergency"], required: true },
    { name: "from", label: "From", type: "date", required: true },
    { name: "to", label: "To", type: "date", required: true },
    { name: "reason", label: "Reason", type: "textarea", required: true },
  ] as MockField[],
  userInvite: [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "role", label: "Role", type: "select", options: ["Teacher", "Student", "Parent", "Accountant", "HR"], required: true },
    { name: "name", label: "Full name", required: true },
  ] as MockField[],
};
