"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany");
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5000/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
      if (Array.isArray(data)) {
        setFavorites(data);
      } else {
        console.error("FAVORITES ERROR:", data);
        setFavorites([]);
      }
})
      .catch((err) => console.error(err));
  }, []);

    async function removeFavorite(restaurantId) {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `http://localhost:5000/favorites/${restaurantId}`,
        {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    if (res.ok) {
        setFavorites((prev) =>
        prev.filter(
            (favorite) => favorite.restaurant.id !== restaurantId
        )
        );
    }
    }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Ulubione restauracje</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">Nie masz jeszcze ulubionych restauracji.</p>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {favorites.map((favorite) => {
            const restaurant = favorite.restaurant;

            return (
              <div
                key={restaurant.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow"
                >
                <div className="flex justify-between items-start">
                <div>
                    <Link href={`/restaurants/${restaurant.id}`}>
                    <h2 className="text-xl font-bold hover:text-blue-400">
                        {restaurant.name}
                    </h2>
                    </Link>

                    <p className="text-gray-300 mt-2">
                    {restaurant.address}
                    </p>
                    
                    <p className="mt-3 text-sm text-gray-400">
                    Liczba recenzji: {restaurant.reviews?.length || 0}
                    </p>

                    <p className="text-gray-400 font-semibold">
                        Średnia ocena:{" "}
                        {restaurant.reviews?.length
                        ? (
                            restaurant.reviews.reduce((sum, review) => sum + review.score, 0) /
                            restaurant.reviews.length
                            ).toFixed(1)
                        : "Brak ocen"}
                    </p>
                </div>

                <button
                    onClick={() => removeFavorite(restaurant.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                    Usuń
                </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}