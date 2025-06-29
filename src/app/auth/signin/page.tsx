// /app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) router.push("/dashboard");
    else alert("Invalid credentials");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Sign In</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ color: "black" }} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ color: "black" }} />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <p className="text-sm">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
