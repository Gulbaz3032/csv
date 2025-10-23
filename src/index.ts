

import express from "express";
import fileUpload from "express-fileupload"
import authRoutes from "./routes/authRoute";
import adminRoutes from "./routes/adminRoute";
import connectDB from "../src/utils/connectDB";

// // Load environment variables
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,      // temporary files enable
  tempFileDir: './tmp'     // temp folder path
}));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to start server:", err);
  });

export default app;



// import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/authRoute";
// import adminRoutes from "./routes/adminRoute";
// import connectDB from "./utils/connectDB";

// // ✅ Load .env at top
// dotenv.config();

// const app = express();
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// app.get("/", (_, res) => res.json({ ok: true }));

// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//   app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// });
