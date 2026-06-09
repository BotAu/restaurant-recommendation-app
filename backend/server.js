const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");
const prisma = require("./prismaClient");
const roleMiddleware = require("./middleware/roleMiddleware");
const restaurantRoutes = require("./routes/restaurants");

const app = express();

const authRoutes = require("./routes/auth");


app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Restaurant API działa" });
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "To jest chroniony profil",
    user: req.user
  });
});

app.get("/admin/test", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Panel admina działa" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});