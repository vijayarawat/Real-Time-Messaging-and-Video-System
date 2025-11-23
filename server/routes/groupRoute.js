import express from "express";
import {
    createGroup,
    getUserGroups,
    getGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupMessages,
    deleteGroup,
    updateGroup,
    joinGroupByCode
} from "../controllers/groupController.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// More specific routes first
router.post("/create", createGroup);
router.get("/user-groups", getUserGroups);
router.post("/join-by-code", joinGroupByCode);

// Messages route (more specific)
router.get("/:groupId/messages", getGroupMessages);

// Generic groupId routes (less specific, after more specific ones)
router.get("/:groupId", getGroup);
router.put("/update/:groupId", updateGroup);
router.delete("/delete/:groupId", deleteGroup);

// Member management
router.post("/add-member", addMemberToGroup);
router.post("/remove-member", removeMemberFromGroup);

export default router;
