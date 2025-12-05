const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");
const userController = require("../middleware/userController");

// Authentication routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/verify-email", userController.verifyEmail);
router.post("/resend-verification", userController.resendVerification);

// User profile routes
router.get("/me", auth, userController.getMe);
router.put("/me", auth, userController.updateProfile);
router.patch("/me", auth, userController.patchProfile);
router.delete("/me", auth, userController.deleteAccount);
router.patch("/me/password", auth, userController.changePassword);
router.post("/upload-profile-picture", auth, userController.uploadProfilePicture);

// Friend management routes
router.post("/friends/request/:id", auth, userController.sendFriendRequest);
router.post("/friends/accept/:id", auth, userController.acceptFriendRequest);
router.post("/friends/reject/:id", auth, userController.rejectFriendRequest);
router.post("/friends/cancel/:id", auth, userController.cancelFriendRequest);
router.delete("/friends/remove/:id", auth, userController.removeFriend);

// Public routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getPublicProfile);

module.exports = router;