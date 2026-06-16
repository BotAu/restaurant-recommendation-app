const express = require("express");
const prisma = require("../prismaClient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function validateReviewInput(restaurantId, score, content) {
  if (restaurantId !== undefined && (typeof restaurantId !== "number" || restaurantId <= 0)) {
    return "Nieprawidłowy identyfikator restauracji.";
  }

  if (typeof score !== "number" || score < 1 || score > 5) {
    return "Ocena musi być w zakresie od 1 do 5.";
  }

  if (content != null && typeof content !== "string") {
    return "Treść recenzji musi być tekstem.";
  }

  if (typeof content === "string" && content.length > 500) {
    return "Treść recenzji nie może przekraczać 500 znaków.";
  }

  return null;
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, score, content } = req.body;
    const validationError = validateReviewInput(restaurantId, score, content);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

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

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { score, content } = req.body;
    const reviewId = Number(req.params.id);
    const validationError = validateReviewInput(undefined, score, content);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ message: "Recenzja nie istnieje" });
    }

    if (review.userId !== req.user.userId) {
      return res.status(403).json({ message: "Nie możesz edytować tej recenzji" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        score,
        content,
      },
    });

    res.json({
      message: "Recenzja zaktualizowana",
      review: updatedReview,
    });
  } catch (error) {
    console.error("PATCH REVIEW ERROR:", error);
    res.status(500).json({ message: "Błąd edycji recenzji" });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ message: "Recenzja nie istnieje" });
    }

    if (review.userId !== req.user.userId) {
      return res.status(403).json({ message: "Nie możesz usunąć tej recenzji" });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.json({ message: "Recenzja usunięta" });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    res.status(500).json({ message: "Błąd usuwania recenzji" });
  }
});

module.exports = router;