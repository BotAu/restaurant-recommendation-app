"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_BASE_URL}/profile`, {
      credentials: "include",
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

      <div className="mt-8 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Twoje oceny</h2>

        {profile.reviews?.length > 0 ? (
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5"
              >
                <p className="text-sm text-gray-400">Restauracja:</p>
                <p className="text-lg font-semibold">
                  {review.restaurant?.name || "Nieznana restauracja"}
                </p>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <p>
                    <span className="text-gray-400">Ocena:</span> {review.score}/5
                  </p>
                  <p>
                    <span className="text-gray-400">Data:</span>{" "}
                    {new Date(review.createdAt).toLocaleDateString("pl-PL")}
                  </p>
                </div>

                <p className="mt-3 text-gray-200">
                  <span className="text-gray-400">Komentarz:</span>{" "}
                  {review.content || "Brak komentarza"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Jeszcze nie dodałeś żadnej oceny.</p>
        )}
      </div>
    </main>
  );
}
