import express from "express";
import { connectDB } from "./config/connectDb";
import sanitizeMiddleware from "./middleware/sanitize";
import routes from "./routes";
import cors from "cors";
import corn from "node-cron"
import { updateExchangeRates } from "./controller/exchangeRates";
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(express.json());
app.use(sanitizeMiddleware);
app.use(cors(corsOptions));

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

corn.schedule('0 0 * * *', async () => updateExchangeRates());
app.use("/api", routes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
