"use client";

import { useState } from "react";

export default function AdminPage() {
  const [city, setCity] = useState("Warsaw");
  const [radiusKm, setRadiusKm] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function importRestaurants() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany jako administrator");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setMessage("");

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `http://localhost:5000/restaurants/nearby/search?city=${city}&radiusKm=${radiusKm}`,
      {
        credentials: "include",
        headers,
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage(`Zapisano ${data.count} restauracji dla miasta ${data.city}`);
    } else {
      setMessage(data.message || "Błąd pobierania restauracji");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Panel administratora</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">
          Zasil bazę restauracjami
        </h2>

        <div className="grid gap-4">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Miasto, np. Warsaw, Krakow"
            className="bg-gray-700 border border-gray-600 p-2 rounded"
          />

          <input
            type="number"
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            placeholder="Zasięg w kilometrach"
            className="bg-gray-700 border border-gray-600 p-2 rounded"
          />

          <button
            onClick={importRestaurants}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:bg-gray-600"
          >
            {loading ? "Pobieranie..." : "Pobierz restauracje do bazy"}
          </button>

          {message && (
            <p className="text-green-400">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}