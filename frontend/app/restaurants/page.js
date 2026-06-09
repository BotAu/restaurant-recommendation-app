"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🍽 Restauracje</h1>

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
    </main>
  );
}