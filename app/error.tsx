"use client";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Shows a generic message only: error details must not be exposed to users (Architecture §37).
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        Please try again. If the problem continues, contact your administrator
        {error.digest ? ` and quote reference ${error.digest}` : ""}.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
