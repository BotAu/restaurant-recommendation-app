const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const prisma = require("./prismaClient");

const authRoutes = require("./routes/auth");
const restaurantRoutes = require("./routes/restaurants");
const reviewRoutes = require("./routes/reviews");
const favoriteRoutes = require("./routes/favorites");

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Zbyt wiele prób. Spróbuj ponownie później." },
});

const reviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Za dużo żądań. Spróbuj później." },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL || "https://restaurant-recommendation-app-chi.vercel.app",
  "https://restaurant-recommendation-app-2.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));
app.use(express.json());

app.use("/auth", authLimiter, authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/reviews", reviewLimiter, reviewRoutes);
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

if (!process.env.JWT_SECRET) {
  console.error("Błąd: brak JWT_SECRET w zmiennych środowiskowych.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});