"use client";

import { useEffect, useState, use } from "react";

export default function RestaurantDetails({ params }) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState(null);
  const [score, setScore] = useState(5);
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(`http://localhost:5000/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error(err));
  }, [id]);

  async function addReview() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      restaurantId: Number(id),
      score,
      content,
    }),
  });

  if (res.ok) {
    alert("Recenzja dodana");
    window.location.reload();
  } else {
    alert("Uzytkownik niezalogowany lub dodal juz recenzje");
  }
}

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
      <div className="mt-10 bg-gray-800 p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">
            Dodaj recenzję
        </h2>

        <select
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="bg-gray-700 p-2 rounded mb-3 w-full"
        >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
        </select>

        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Napisz opinię..."
            className="bg-gray-700 p-2 rounded w-full mb-3"
        />

        <button
            onClick={addReview}
            className="bg-blue-600 px-4 py-2 rounded"
        >
            Dodaj recenzję
        </button>
    </div>
    </main>
  );
}