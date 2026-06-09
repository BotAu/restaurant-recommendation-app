"use client";

import Link from "next/link";
import { useState } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState("Warsaw");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);


  async function loadRestaurantsFromDatabase() {
  const params = new URLSearchParams();

  if (city) {
    params.append("city", city);
  }

  if (search) {
    params.append("search", search);
  }

  const res = await fetch(`http://localhost:5000/restaurants?${params.toString()}`);
  const data = await res.json();

  setRestaurants(data);
}

  async function fetchFromApi() {
    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/restaurants/nearby/search?city=${city}`
    );

    const data = await res.json();

    if (res.ok) {
        await loadRestaurantsFromDatabase();
    } 
    else {
        alert(data.message || "Błąd pobierania restauracji");
    }

    setLoading(false);
  }


  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🍽 Restauracje</h1>

      <div className="mb-8 grid gap-3 max-w-xl">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Wpisz miasto, np. Krakow"
          className="bg-gray-800 border border-gray-700 p-2 rounded"
        />

        <button
          onClick={fetchFromApi}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:bg-gray-600"
        >
          {loading ? "Pobieranie..." : "Pobierz restauracje z miasta"}
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj restauracji po nazwie..."
          className="bg-gray-800 border border-gray-700 p-2 rounded"
        />
        <button
            onClick={loadRestaurantsFromDatabase}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
            Szukaj w bazie
        </button>
      </div>

      {restaurants.length === 0 ? (
        <p className="text-gray-400">
          Wybierz miasto i pobierz restauracje.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link
              href={`/restaurants/${restaurant.id}`}
              key={restaurant.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow hover:bg-gray-700 transition block"
            >
              <h2 className="text-xl font-bold">{restaurant.name}</h2>

              <p className="text-gray-300 mt-2">{restaurant.address}</p>

              <p className="mt-3 text-sm text-gray-400">
                Liczba recenzji: {restaurant.reviews?.length || 0}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}