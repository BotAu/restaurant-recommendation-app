"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <nav className="bg-gray-950 text-white px-8 py-4 border-b border-gray-800">
      <div className="flex gap-6 items-center">
        <Link href="/" className="font-bold text-xl">
          RestaurantApp
        </Link>

        <Link href="/restaurants" className="hover:text-gray-300">
          Restauracje
        </Link>
        {user && (
          <Link href="/favorites" className="hover:text-gray-300">
            Ulubione
        </Link>
        )}

        {user && (
          <Link href="/profile" className="hover:text-gray-300">
            Profil
          </Link>
        )}

        {user?.role === "admin" && (
          <Link href="/admin" className="hover:text-gray-300">
            Admin
          </Link>
        )}

        {!user ? (
          <>
            <Link href="/register" className="hover:text-gray-300">
              Rejestracja
            </Link>

            <Link href="/login" className="hover:text-gray-300">
              Logowanie
            </Link>
          </>
          

        ) : (
          <>
            <span className="text-gray-300">
              Zalogowano jako: {user.username}
            </span>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Wyloguj
            </button>
          </>
        )}
      </div>
    </nav>
  );
}