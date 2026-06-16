const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const prisma = require("./prismaClient");

const authRoutes = require("./routes/auth");
const restaurantRoutes = require("./routes/restaurants");
const reviewRoutes = require("./routes/reviews");
const favoriteRoutes = require("./routes/favorites");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/reviews", reviewRoutes);
app.use("/favorites", favoriteRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Restaurant API działa" });
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        reviews: {
          select: {
            id: true,
            score: true,
            content: true,
            createdAt: true,
            restaurant: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        favorites: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Błąd pobierania profilu" });
  }
});

app.get("/admin/test", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Panel admina działa" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});