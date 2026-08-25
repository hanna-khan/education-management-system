import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-md)]">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <p className="text-sm text-[var(--muted)]">
            Enter your institution email and we&apos;ll send a reset link.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email address</label>
            <Input id="email" type="email" placeholder="you@institution.edu.pk" />
          </div>
          <Button asChild className="w-full">
            <Link href="/reset-password">
              Send reset link
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login"><ArrowLeft className="size-4" />Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
