const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

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

module.exports = router;