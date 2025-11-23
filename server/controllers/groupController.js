import Group from "../models/groupModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";

// Helper function to generate unique join code
const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Generate a simple SVG avatar as a data URI (no external requests)
const createAvatarDataUrl = (text, size = 100, bg = '#7480FF', color = '#FFFFFF') => {
    const initials = (text || '').substring(0, 2).toUpperCase();
    const fontSize = Math.floor(size * 0.45);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
        `<rect width='100%' height='100%' fill='${bg}'/>` +
        `<text x='50%' y='50%' dy='.35em' text-anchor='middle' fill='${color}' font-family='Arial, Helvetica, sans-serif' font-size='${fontSize}' font-weight='700'>${initials}</text>` +
        `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Create a new group
export const createGroup = asyncHandler(async (req, res, next) => {
    const { groupName, description, memberIds } = req.body;
    const adminId = req.user.id;

    if (!groupName) {
        return next(new errorHandler("Group name is required", 400));
    }

    const allMembers = [...new Set([adminId, ...memberIds])]; // Remove duplicates

    // Generate unique join code
    let joinCode;
    let codeExists = true;
    while (codeExists) {
        joinCode = generateJoinCode();
        codeExists = await Group.findOne({ joinCode });
    }

    const group = new Group({
        groupName,
        description: description || "",
        admin: adminId,
        members: allMembers,
        joinCode,
        groupIcon: createAvatarDataUrl(groupName.substring(0, 2).toUpperCase())
    });

    await group.save();
    await group.populate(['admin', 'members']);

    res.status(201).json({
        success: true,
        message: "Group created successfully",
        group
    });
});

// Get all groups for a user
export const getUserGroups = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const groups = await Group.find({ members: userId })
        .populate(['admin', 'members'])
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        groups
    });
});

// Get a specific group
export const getGroup = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
        .populate(['admin', 'members']);

    if (!group) {
        return next(new errorHandler("Group not found", 404));
    }

    res.status(200).json({
        success: true,
        group
    });
});

// Add member to group
export const addMemberToGroup = asyncHandler(async (req, res, next) => {
    const { groupId, memberId } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
        return next(new errorHandler("Group not found", 404));
    }

    if (group.admin.toString() !== adminId.toString()) {
        return next(new errorHandler("Only admin can add members", 403));
    }

    if (group.members.includes(memberId)) {
        return next(new errorHandler("User already in group", 400));
    }

    group.members.push(memberId);
    await group.save();
    await group.populate(['admin', 'members']);

    res.status(200).json({
        success: true,
        message: "Member added successfully",
        group
    });
});

// Remove member from group
export const removeMemberFromGroup = asyncHandler(async (req, res, next) => {
    const { groupId, memberId } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
        return next(new errorHandler("Group not found", 404));
    }

    if (group.admin.toString() !== adminId.toString()) {
        return next(new errorHandler("Only admin can remove members", 403));
    }

    group.members = group.members.filter(m => m.toString() !== memberId.toString());
    await group.save();
    await group.populate(['admin', 'members']);

    res.status(200).json({
        success: true,
        message: "Member removed successfully",
        group
    });
});

// Get group messages
export const getGroupMessages = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const messages = await Message.find({
        groupId,
        messageType: 'group'
    })
        .populate('senderId', 'userName fullName avatar')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        messages
    });
});

// Delete group (only admin)
export const deleteGroup = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
        return next(new errorHandler("Group not found", 404));
    }

    if (group.admin.toString() !== adminId.toString()) {
        return next(new errorHandler("Only admin can delete group", 403));
    }

    await Message.deleteMany({ groupId });
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
        success: true,
        message: "Group deleted successfully"
    });
});

// Update group
export const updateGroup = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const { groupName, description } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
        return next(new errorHandler("Group not found", 404));
    }

    if (group.admin.toString() !== adminId.toString()) {
        return next(new errorHandler("Only admin can update group", 403));
    }

    if (groupName) group.groupName = groupName;
    if (description) group.description = description;

    await group.save();
    await group.populate(['admin', 'members']);

    res.status(200).json({
        success: true,
        message: "Group updated successfully",
        group
    });
});

// Join group by code
export const joinGroupByCode = asyncHandler(async (req, res, next) => {
    const { joinCode } = req.body;
    const userId = req.user.id;

    if (!joinCode) {
        return next(new errorHandler("Join code is required", 400));
    }

    const group = await Group.findOne({ joinCode }).populate(['admin', 'members']);

    if (!group) {
        return next(new errorHandler("Invalid join code. Group not found", 404));
    }

    // Check if user is already a member
    if (group.members.some(member => member._id.toString() === userId.toString())) {
        return next(new errorHandler("You are already a member of this group", 400));
    }

    // Add user to group
    group.members.push(userId);
    await group.save();
    await group.populate(['admin', 'members']);

    res.status(200).json({
        success: true,
        message: "Successfully joined the group",
        group
    });
});
