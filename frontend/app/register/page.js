"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Rejestracja</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
        <input className="border p-2" placeholder="Nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="bg-black text-white p-2 rounded">
          Zarejestruj
        </button>
      </form>
    </main>
  );
}