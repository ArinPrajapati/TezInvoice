import express from "express";
import { connectDB } from "./config/connectDb";
import sanitizeMiddleware from "./middleware/sanitize";
import routes from "./routes";
import cors from "cors";
import corn from "node-cron"
import { updateExchangeRates } from "./controller/exchangeRates";
const corsOptions = {
  origin: "*", // Allow all origins. Adjust this as needed for security.
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
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
