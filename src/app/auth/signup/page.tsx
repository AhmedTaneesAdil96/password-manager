// /app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push("/auth/signin");
    else alert("User already exists or error occurred");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Sign Up</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ color: "black" }} />
        <Button type="submit" className="w-full">
          Create Account
        </Button>
        <p className="text-sm">
          Already have an account?{" "}
          <a href="/auth/signin" className="underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
