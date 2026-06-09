"use client";

import { useEffect, useState, use } from "react";

export default function RestaurantDetails({ params }) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        Ładowanie...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>

      <p className="text-gray-300 mb-8">{restaurant.address}</p>

      <h2 className="text-2xl font-bold mb-4">Recenzje</h2>

      {!restaurant.reviews || restaurant.reviews.length === 0 ? (
        <p>Brak recenzji.</p>
      ) : (
        restaurant.reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 p-4 rounded mb-3">
            <p>Ocena: {review.score}/5</p>
            <p>{review.content}</p>
          </div>
        ))
      )}
    </main>
  );
}