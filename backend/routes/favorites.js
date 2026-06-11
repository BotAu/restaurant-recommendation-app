const express = require("express");
const prisma = require("../prismaClient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId } = req.body;

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        restaurantId: Number(restaurantId),
      },
    });

    res.status(201).json({
      message: "Dodano do ulubionych",
      favorite,
    });
  } catch (error) {
    console.error("ADD FAVORITE ERROR:", error);
    res.status(500).json({
      message: "Nie udało się dodać do ulubionych",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        restaurant: {
          include: {
            reviews: true,
          },
        },
      },
    });

    res.json(favorites);
  } catch (error) {
    console.error("GET FAVORITES ERROR:", error);
    res.status(500).json({
      message: "Nie udało się pobrać ulubionych",
    });
  }
});

router.delete("/:restaurantId", authMiddleware, async (req, res) => {
  try {
    await prisma.favorite.delete({
      where: {
        userId_restaurantId: {
          userId: req.user.userId,
          restaurantId: Number(req.params.restaurantId),
        },
      },
    });

    res.json({
      message: "Usunięto z ulubionych",
    });
  } catch (error) {
    console.error("DELETE FAVORITE ERROR:", error);
    res.status(500).json({
      message: "Nie udało się usunąć z ulubionych",
    });
  }
});

router.get("/check/:restaurantId", authMiddleware, async (req, res) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: req.user.userId,
          restaurantId: Number(req.params.restaurantId),
        },
      },
    });

    res.json({
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("CHECK FAVORITE ERROR:", error);
    res.status(500).json({
      message: "Nie udało się sprawdzić ulubionych",
    });
  }
});

module.exports = router;