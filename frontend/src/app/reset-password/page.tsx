"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockToastButton } from "@/components/shared/mock-action";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-md)]">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <p className="text-sm text-[var(--muted)]">
            Choose a strong password for your Zendrock account. This is a demo screen — no password is stored.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <Input id="password" type="password" placeholder="At least 10 characters" />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm password
            </label>
            <Input id="confirm" type="password" placeholder="Re-enter password" />
          </div>
          <MockToastButton
            className="w-full"
            label="Update password"
            message="Password updated (demo). You can sign in with your demo account."
            size="default"
          />
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
