import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get all users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get messages for a specific user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark a message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send a message
messageRouter.post("/send", protectRoute, sendMessage);

export default messageRouter;
