"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function RestaurantDetails({ params }) {
  const { id } = params;

  const [restaurant, setRestaurant] = useState(null);
  const [score, setScore] = useState(5);
  const [content, setContent] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editScore, setEditScore] = useState(5);
  const [editContent, setEditContent] = useState("");


  useEffect(() => {
    fetch(`${API_BASE_URL}/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error(err));

    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/favorites/check/${id}`, {
      credentials: "include",
      headers,
    })
      .then((res) => res.json())
      .then((data) => setIsFavorite(data.isFavorite))
      .catch((err) => console.error(err));

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [id]);

  async function addReview() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany, żeby dodać recenzję");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        restaurantId: Number(id),
        score,
        content,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.reload();
    } else {
      alert(data.message || "Nie udało się dodać recenzji");
    }
  }

  async function deleteReview(reviewId) {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  function startEditing(review) {
    setEditingReviewId(review.id);
    setEditScore(review.score);
    setEditContent(review.content);
  }

  async function saveEdit() {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${API_BASE_URL}/reviews/${editingReviewId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({
          score: editScore,
          content: editContent,
        }),
      }
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  async function addToFavorites() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/favorites`, {
      method: "POST",
      credentials: "include",
      headers,
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

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/favorites/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers,
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

            {user && review.userId === user.id && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEditing(review)}
                  className="bg-yellow-600 px-3 py-1 rounded"
                >
                  Edytuj
                </button>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Usuń
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <div className="mt-10 bg-gray-800 p-4 rounded">

        {editingReviewId && (
  <div className="mt-6 bg-gray-800 p-4 rounded">
    <h2 className="text-xl font-bold mb-3">Edytuj recenzję</h2>

        <select
          value={editScore}
          onChange={(e) => setEditScore(Number(e.target.value))}
          className="bg-gray-700 p-2 rounded mb-3 w-full"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="bg-gray-700 p-2 rounded w-full mb-3"
        />

        <button
          type="button"
          onClick={saveEdit}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Zapisz zmiany
        </button>
      </div>
    )}

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