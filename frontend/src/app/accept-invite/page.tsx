"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, setInstitutionHeader, setStoredSession, setToken } from "@/lib/api";
import { useApp } from "@/hooks/use-app";
import { acceptInvitation, getInviteByToken } from "@/services/staff";

function AcceptInviteForm() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") || "";
  const { setSession } = useApp();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<{
    email: string;
    name?: string;
    roleLabel?: string;
    institutionName?: string;
    campuses?: Array<{ name: string }>;
  } | null>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (!token) {
      setError("This invitation link is missing information.");
      setLoading(false);
      return;
    }
    getInviteByToken(token)
      .then((data) => {
        if (!data.valid) {
          setError(data.message || "This invitation is no longer valid.");
          return;
        }
        setInvite({
          email: data.email || "",
          name: data.name,
          roleLabel: data.roleLabel,
          institutionName: data.institutionName,
          campuses: data.campuses,
        });
        if (data.name) setName(data.name);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not open this invitation.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await acceptInvitation({
        token,
        name,
        password,
        password_confirmation: passwordConfirmation,
      });
      setToken(result.token);
      if (result.institution?.id) setInstitutionHeader(result.institution.id);
      setStoredSession({ user: result.user, institution: result.institution });
      setSession(result.user, result.institution);
      if (result.institution && !result.institution.onboardingCompleted) {
        router.push("/onboarding");
      } else if (result.user.role === "teacher") {
        router.push("/teacher/dashboard");
      } else if (result.user.role === "student") {
        router.push("/student/dashboard");
      } else if (result.user.role === "parent") {
        router.push("/parent/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
        <Loader2 className="size-7 animate-spin text-[#6B58F6]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[#E8E4F4] bg-white p-7 shadow-[0_18px_50px_-28px_rgba(107,88,246,0.28)] sm:p-8">
        <div className="mb-6 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-sm font-bold text-white">
          Z
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#3D3558]">Join your team</h1>
        {invite ? (
          <p className="mt-2 text-sm text-[#8B86A3]">
            You&apos;re joining <strong className="text-[#3D3558]">{invite.institutionName}</strong>
            {invite.roleLabel ? (
              <>
                {" "}
                as <strong className="text-[#3D3558]">{invite.roleLabel}</strong>
              </>
            ) : null}
            .
          </p>
        ) : (
          <p className="mt-2 text-sm text-[#8B86A3]">Complete your account setup.</p>
        )}

        {invite?.campuses && invite.campuses.length > 0 ? (
          <p className="mt-2 text-xs text-[#6B58F6]">
            Campus: {invite.campuses.map((c) => c.name).join(", ")}
          </p>
        ) : null}

        {error && !invite ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            <Button asChild className="w-full rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]">
              <Link href="/login">Go to sign in</Link>
            </Button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#3D3558]">Email</label>
              <Input
                className="h-11 rounded-xl border-[#E8E4F4] bg-[#F8F7FC]"
                value={invite?.email || ""}
                readOnly
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#3D3558]">Your full name</label>
              <Input
                className="h-11 rounded-xl border-[#E8E4F4]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#3D3558]">Create password</label>
              <Input
                type="password"
                minLength={8}
                className="h-11 rounded-xl border-[#E8E4F4]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#3D3558]">Confirm password</label>
              <Input
                type="password"
                minLength={8}
                className="h-11 rounded-xl border-[#E8E4F4]"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>
            {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Create account
              {!submitting ? <ArrowRight className="size-4" /> : null}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
          <Loader2 className="size-6 animate-spin text-[#6B58F6]" />
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
