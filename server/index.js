import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB Successfully");
	})
	.catch((err) => {
		console.log(err);
	});

app.get("/ping", (_req, res) => {
	return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
	console.log(`Server started on ${process.env.PORT}`)
);
const io = new Server(server, {
	cors: {
		origin: "*",
		credentials: true,
	},
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
	global.chatSocket = socket;
	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-recieve", data.msg);
		}
	});
});
