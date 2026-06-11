"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(
      `http://localhost:5000/restaurants?city=${city}&search=${search}`
    )
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));
  }, [city, search]);

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const avgA = a.reviews?.length
      ? a.reviews.reduce((sum, r) => sum + r.score, 0) /
        a.reviews.length
      : 0;

    const avgB = b.reviews?.length
      ? b.reviews.reduce((sum, r) => sum + r.score, 0) /
        b.reviews.length
      : 0;

    return avgB - avgA;
  });

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Restauracje
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Szukaj restauracji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-2 rounded"
        />

        <input
          type="text"
          placeholder="Miasto..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-2 rounded"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedRestaurants.map((restaurant) => {
          const averageRating = restaurant.reviews?.length
            ? (
                restaurant.reviews.reduce(
                  (sum, review) => sum + review.score,
                  0
                ) / restaurant.reviews.length
              ).toFixed(1)
            : null;

          return (
            <Link
              href={`/restaurants/${restaurant.id}`}
              key={restaurant.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow hover:bg-gray-700 transition block"
            >
              <h2 className="text-xl font-bold">
                {restaurant.name}
              </h2>

              <p className="text-gray-300 mt-2">
                {restaurant.address}
              </p>

              <p className="mt-3 text-sm text-gray-400">
                Liczba recenzji:{" "}
                {restaurant.reviews?.length || 0}
              </p>

              <p
                className={`font-semibold mt-2 ${
                  averageRating >= 4
                    ? "text-green-400"
                    : averageRating >= 2.5
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                ⭐ {averageRating || "Brak ocen"}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}