// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // npm install node-fetch@2

console.log("Restaurants router loaded");

const app = express();
<<<<<<< HEAD

const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");


app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/reviews", reviewRoutes);
=======
app.use(cors());
app.use(express.json());

const GEOAPIFY_API_KEY = 'c534d686afa54d54b720e94698b447cd'; // Twój klucz

// Endpoint do pobierania restauracji
app.get('/restaurants', async (req, res) => {
  const {
    lat = 50.0413,
    lon = 21.9990,
    radius = 1000,
    limit = 50,
    offset = 0
  } = req.query;
>>>>>>> 11ac433dace0eb68008add3feb72c3aefb0c47b1

  const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},${radius}&limit=${limit}&offset=${offset}&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const restaurants = data.features.map((place) => ({
      id: place.properties.place_id,
      name: place.properties.name,
      cuisine: place.properties.cuisine || 'N/A',
      address: place.properties.formatted,
      lat: place.properties.lat,
      lon: place.properties.lon,
    }));

    res.json(restaurants);
  } catch (error) {
    console.error('Błąd pobierania restauracji:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));