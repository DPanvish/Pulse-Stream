import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();

await connectDB();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.io Setup
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

// Middleware
app.use(cors());
app.use(express.json());
// Inject Socket.io into every request (Middleware)
// This allows us to use 'req.io' in our controllers!
app.use((req, res, next) => {
    req.io = io;
    next();
})

app.get("/", (req, res) => {
    res.send("Hello Pulse Stream");
})

// Routes
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

// Socket.io Connection Logic
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    })
})

// Error Handling
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});


httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})