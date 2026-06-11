"use client";

import { useEffect, useState, use } from "react";

export default function RestaurantDetails({ params }) {
  const { id } = use(params);

  const [restaurant, setRestaurant] = useState(null);
  const [score, setScore] = useState(5);
  const [content, setContent] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error(err));

    const token = localStorage.getItem("token");

    if (token) {
      fetch(`http://localhost:5000/favorites/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setIsFavorite(data.isFavorite))
        .catch((err) => console.error(err));
    }
  }, [id]);

  async function addReview() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany, żeby dodać recenzję");
      return;
    }

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

    const data = await res.json();

    if (res.ok) {
      alert("Recenzja dodana");
      window.location.reload();
    } else {
      alert(data.message || "Nie udało się dodać recenzji");
    }
  }

  async function addToFavorites() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany");
      return;
    }

    const res = await fetch("http://localhost:5000/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        restaurantId: Number(id),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setIsFavorite(true);
    }

    alert(data.message);
  }

  

  async function removeFromFavorites() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany");
      return;
    }

    const res = await fetch(`http://localhost:5000/favorites/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setIsFavorite(false);
    }

    alert(data.message);
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        Ładowanie...
      </main>
    );
  }

  const averageRating = restaurant.reviews?.length
  ? (
      restaurant.reviews.reduce((sum, review) => sum + review.score, 0) /
      restaurant.reviews.length
    ).toFixed(1)
  : null;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>

      <p className="text-gray-300 mb-8">{restaurant.address}</p>

      <p
        className={`font-semibold mb-6 ${
          averageRating >= 4
            ? "text-green-400"
            : averageRating >= 2.5
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        Średnia ocena: {averageRating || "Brak ocen"}
      </p>

      {isFavorite ? (
        <button
          onClick={removeFromFavorites}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mb-8"
        >
          Usuń z ulubionych
        </button>
      ) : (
        <button
          onClick={addToFavorites}
          className="bg-blue-600 hover:bg-blue-900 px-4 py-2 rounded mb-8"
        >
          Dodaj do ulubionych
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4">Recenzje</h2>

      {!restaurant.reviews || restaurant.reviews.length === 0 ? (
        <p>Brak recenzji.</p>
      ) : (
        restaurant.reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 p-4 rounded mb-3">
            <h3 className="font-bold">
              {review.user?.username || "Nieznany użytkownik"}
            </h3>

            <p className="text-green-400">Ocena: {review.score}/5</p>

            <p>{review.content}</p>
          </div>
        ))
      )}

      <div className="mt-10 bg-gray-800 p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">Dodaj recenzję</h2>

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

        <button onClick={addReview} className="bg-blue-600 hover:bg-blue-900 px-4 py-2 rounded">
          Dodaj recenzję
        </button>
      </div>
    </main>
  );
}