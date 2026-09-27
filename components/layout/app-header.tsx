import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

type AppHeaderProps = {
  userEmail: string | undefined;
};

export function AppHeader({ userEmail }: AppHeaderProps) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <span className="font-semibold">Comply360</span>
        <div className="flex items-center gap-3 text-sm">
          {userEmail ? <span className="text-muted-foreground">{userEmail}</span> : null}
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
