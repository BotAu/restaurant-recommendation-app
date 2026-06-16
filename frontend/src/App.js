import React, { useEffect, useState } from 'react';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState('50.0413');
  const [lon, setLon] = useState('21.9990');
  const [radius, setRadius] = useState('1000');
  const [limit] = useState(50); // ile pobierać na raz
  const [offset, setOffset] = useState(0); // do paginacji
  const [hasMore, setHasMore] = useState(true); // czy są jeszcze wyniki

  const fetchRestaurants = async (reset = false) => {
    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const res = await fetch(
        `${API_BASE_URL}/restaurants?lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}&offset=${currentOffset}`
      );
      const data = await res.json();

      if (reset) {
        setRestaurants(data);
      } else {
        setRestaurants(prev => [...prev, ...data]);
      }

      setOffset(currentOffset + data.length);
      setHasMore(data.length === limit); // jeśli przyszło mniej niż limit, to już koniec
    } catch (error) {
      console.error('Błąd pobierania restauracji:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pobranie domyślnych restauracji przy uruchomieniu
  useEffect(() => {
    fetchRestaurants(true);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchRestaurants();
    }
  };

  const handleSearch = () => {
    setOffset(0);
    setHasMore(true);
    fetchRestaurants(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Restaurant Explorer</h1>

      {/* Formularz filtracji */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Latitude:{' '}
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            style={{ width: '100px' }}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Longitude:{' '}
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            style={{ width: '100px' }}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Radius (m):{' '}
          <input
            type="text"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            style={{ width: '80px' }}
          />
        </label>
        <button
          onClick={handleSearch}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {restaurants.length === 0 && !loading && <p>No restaurants found.</p>}

      {restaurants.map((r) => (
        <div
          key={r.id}
          style={{
            border: '1px solid #ccc',
            margin: '10px 0',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <h3>{r.name}</h3>
          <p>Cuisine: {r.cuisine}</p>
          <p>Address: {r.address}</p>
          <p>
            Coordinates: {r.lat}, {r.lon}
          </p>
        </div>
      ))}

      {hasMore && !loading && (
        <button
          onClick={handleLoadMore}
          style={{ padding: '10px 20px', marginTop: '20px' }}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default App;