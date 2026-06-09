const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

console.log("restaurants.js loaded");

router.get("/", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        category: true,
        reviews: true,
      },
    });

    res.json(restaurants);
  } catch (error) {
    console.error("GET RESTAURANTS ERROR:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        reviews: true,
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