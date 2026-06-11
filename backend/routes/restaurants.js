const express = require("express");
const prisma = require("../prismaClient");
const axios = require("axios");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

console.log("restaurants.js loaded");

router.get("/", async (req, res) => {
  try {
    const { city, search } = req.query;

    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          city
            ? {
                address: {
                  contains: city,
                  mode: "insensitive",
                },
              }
            : {},
          search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      },
      include: {
        category: true,reviews: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(restaurants);
  } catch (error) {
    console.error("GET RESTAURANTS ERROR:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.get(
  "/nearby/search",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
  try {
    const { city = "Warsaw", radiusKm = 5 } = req.query;
    const radiusMeters = Number(radiusKm) * 1000;

    const geocodeResponse = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: {
          text: city,
          limit: 1,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );

    const cityData = geocodeResponse.data.features[0];

    if (!cityData) {
      return res.status(404).json({
        message: "Nie znaleziono miasta",
      });
    }

    const [lng, lat] = cityData.geometry.coordinates;

    const placesResponse = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories: "catering.restaurant",
          filter: `circle:${lng},${lat},${radiusMeters}`,
          limit: 200,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );

    const places = placesResponse.data.features || [];
    const savedRestaurants = [];

    for (const place of places) {
      const p = place.properties;

      const restaurant = await prisma.restaurant.upsert({
        where: {
          externalApiId: p.place_id,
        },
        update: {
          name: p.name || "Bez nazwy",
          address: p.formatted || p.address_line2 || null,
          latitude: p.lat || null,
          longitude: p.lon || null,
        },
        create: {
          externalApiId: p.place_id,
          name: p.name || "Bez nazwy",
          address: p.formatted || p.address_line2 || null,
          latitude: p.lat || null,
          longitude: p.lon || null,
        },
      });

      savedRestaurants.push(restaurant);
    }

    res.json({
    message: `Zapisano restauracje dla miasta: ${city}`,
    city,
    count: savedRestaurants.length,
    });
    } catch (error) {
    console.error("GEOAPIFY ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Błąd pobierania restauracji",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        category: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Nie znaleziono restauracji",
      });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Błąd serwera",
    });
  }
});

module.exports = router;