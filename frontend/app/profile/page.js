"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        Ładowanie profilu...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Profil użytkownika</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-xl">
        <p>
          <span className="text-gray-400">Nazwa użytkownika:</span>{" "}
          {profile.username}
        </p>

        <p className="mt-3">
          <span className="text-gray-400">Email:</span> {profile.email}
        </p>

        <p className="mt-3">
          <span className="text-gray-400">Rola:</span> {profile.role}
        </p>

        <p className="mt-3">
          <span className="text-gray-400">Liczba recenzji:</span>{" "}
          {profile.reviews?.length || 0}
        </p>

        <p className="mt-3">
          <span className="text-gray-400">Liczba ulubionych:</span>{" "}
          {profile.favorites?.length || 0}
        </p>
      </div>
    </main>
  );
}