import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  // The sign-in method is an open decision (ADR-004, ADR-005). Until it is chosen in
  // Phase 2, this page intentionally offers no way to sign in.
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in to Comply360</CardTitle>
          <CardDescription>Sign-in is not available yet.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The sign-in method will be configured in a later release.
        </CardContent>
      </Card>
    </main>
  );
}
