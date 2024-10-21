import express from "express";
import { connectDB } from "./config/connectDb";
import sanitizeMiddleware from "./middleware/sanitize";
import routes from "./routes";
const app = express();
app.use(express.json());
app.use(sanitizeMiddleware);
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", routes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
