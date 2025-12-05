const userService = require("../services/userService");

// Controller functions
const userController = {

  // Signup new user
  async signup(req, res) {
    try {
      const { username, password, email, bio } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const result = await userService.createUser({ username, password, email, bio });

      res.json({
        message: "Signup successful! Please verify your email.",
        requiresEmailVerification: true,
        username: result.username,
      });
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const result = await userService.loginUser({ username, password });

      res.json({
        message: "Login successful!",
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      const status = err.status || 500;
      const response = { error: err.message || "Server error" };
      if (err.requiresEmailVerification) {
        response.requiresEmailVerification = true;
      }
      res.status(status).json(response);
    }
  },

  // Get my profile
  async getMe(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const user = await userService.getUserById(req.user.id);
      res.json(user);
    } catch (err) {
      const status = err.status || 401;
      res.status(status).json({ error: err.message || "Invalid token" });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Search users by username
  async searchUsers(req, res) {
    try {
      const query = req.query.q;
      const users = await userService.searchUsers(query);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
      res.json(updatedUser);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Patch user profile
  async patchProfile(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const updatedUser = await userService.patchUser(req.user.id, req.body);
      res.json(updatedUser);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Upload profile picture
  async uploadProfilePicture(req, res) {
    return res.json({ message: "Profile picture uploaded successfully!" });
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Old and new passwords required" });
      }

      await userService.changePassword(req.user.id, { oldPassword, newPassword });

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Delete account
  //(plus game lists, reviews, friend connections & requests)
  async deleteAccount(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: "Password is required to delete the account" });
      }
      await GameList.deleteMany({ userId: req.user.id });
      await Review.deleteMany( { user: req.user.id });
      await User.updateMany(
        { friends: req.user.id },
        { $pull: { friends: req.user.id } }
      );
      await User.updateMany(
        { $or: [
          { friendRequestsSent: req.user.id },
          { friendRequestsReceived: req.user.id }
        ]},
        { $pull: { 
          friendRequestsSent: req.user.id,
          friendRequestsReceived: req.user.id
        }}
      );
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account permanently deleted" });

      await userService.deleteUser(req.user.id, password);

      res.json({ message: "Account permanently deleted" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { username, code } = req.body;

      if (!username || !code) {
        return res.status(400).json({ error: "Missing username or code" });
      }

      await userService.verifyEmail({ username, code });

      res.json({ message: "Email verified successfully" });
    } catch (err) {
      console.error("Verify-email error:", err);
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Resend verification code
  async resendVerification(req, res) {
    try {
      const { username } = req.body;

      await userService.resendVerification(username);

      res.json({ message: "New verification code sent" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Send friend request
  async sendFriendRequest(req, res) {
    try {
      const myId = req.user.id;
      const targetId = req.params.id;

      await userService.sendFriendRequest(myId, targetId);

      res.json({ message: "Friend request sent" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Accept friend request
  async acceptFriendRequest(req, res) {
    try {
      const myId = req.user.id;
      const fromId = req.params.id;

      await userService.acceptFriendRequest(myId, fromId);

      res.json({ message: "Friend request accepted" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Reject friend request
  async rejectFriendRequest(req, res) {
    try {
      const myId = req.user.id;
      const fromId = req.params.id;

      await userService.rejectFriendRequest(myId, fromId);

      res.json({ message: "Friend request rejected" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Cancel sent friend request
  async cancelFriendRequest(req, res) {
    try {
      const myId = req.user.id;
      const targetId = req.params.id;

      await userService.cancelFriendRequest(myId, targetId);

      res.json({ message: "Friend request canceled" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Remove friend
  async removeFriend(req, res) {
    try {
      const myId = req.user.id;
      const friendId = req.params.id;

      await userService.removeFriend(myId, friendId);

      res.json({ message: "Friend removed" });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },

  // Get public profile
  async getPublicProfile(req, res) {
    try {
      const user = await userService.getPublicProfile(req.params.id);
      res.json(user);
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Server error" });
    }
  },
};

module.exports = userController;
