"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Supabase auth scaffold only. Local mode still uses the mock user switcher.");

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : "Signed in. You can return to the workspace.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  }

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setMessage("Signed out.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  return (
    <main className="min-h-screen bg-eventum-bg px-6 py-16 text-eventum-text">
      <div className="mx-auto max-w-md">
        <Card>
          <p className="text-sm text-eventum-muted">Phase 3 auth foundation</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Login</h1>
          <p className="mt-3 text-sm leading-6 text-eventum-muted">{message}</p>
          <form onSubmit={signIn} className="mt-6 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="field"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="field"
            />
            <div className="flex gap-2">
              <Button type="submit">Sign in</Button>
              <Button type="button" variant="secondary" onClick={signOut}>Sign out</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
