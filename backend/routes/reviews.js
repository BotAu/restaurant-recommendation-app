const express = require("express");
const prisma = require("../prismaClient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, score, content } = req.body;

    const review = await prisma.review.create({
      data: {
        restaurantId,
        score,
        content,
        userId: req.user.userId,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Błąd serwera",
    });
  }
});

module.exports = router;