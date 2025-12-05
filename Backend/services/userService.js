

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const defaultPictures = [
  "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/default_profile_blue.png?rand=" + Math.random(),
  "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/default_profile_green.png?rand=" + Math.random(),
  "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/default_profile_red.png?rand=" + Math.random(),
];

const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const getRandomDefaultPicture = () =>
  defaultPictures[Math.floor(Math.random() * defaultPictures.length)];


// Service functions
const userService = {
  async createUser({ username, password, email, bio }) {
    // Check for duplicate username
    const existing = await User.findOne({ username });
    if (existing) {
      throw { status: 409, message: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateVerificationCode();

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      bio,
      profilePicture: getRandomDefaultPicture(),
      isVerified: false,
      emailVerificationCode: code,
      emailVerificationExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await newUser.save();

    // Send verification email
    await sendEmail(
      email,
      "Verify your CHECKPOINT account",
      `Your verification code is: ${code}`
    );

    return { username };
  },

  // Login user
  async loginUser({ username, password }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw { status: 401, message: "Invalid credentials" };
    }

    if (!user.isVerified) {
      throw {
        status: 403,
        message: "Email not verified. Please check your inbox.",
        requiresEmailVerification: true,
      };
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    };
  },

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("friends", "username profilePicture")
      .populate("friendRequestsSent", "username profilePicture")
      .populate("friendRequestsReceived", "username profilePicture");

    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    return user;
  },

  // Get all users
  async getAllUsers() {
    return await User.find();
  },

  // Search users by username
  async searchUsers(query) {
    if (!query || !query.trim()) {
      return [];
    }
    
    const users = await User.find({
      username: { $regex: query.trim(), $options: "i" }
    }).select("username profilePicture bio friends friendRequestsSent friendRequestsReceived");
    
    return users;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const allowedUpdates = {};
    if (updates.email) allowedUpdates.email = updates.email;
    if (updates.bio) allowedUpdates.bio = updates.bio;
    if (updates.profilePicture) allowedUpdates.profilePicture = updates.profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw { status: 404, message: "User not found" };
    }

    return updatedUser;
  },

  // Patch user profile
  async patchUser(userId, updates) {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw { status: 404, message: "User not found" };
    }

    return updatedUser;
  },

  // Change user password
  async changePassword(userId, { oldPassword, newPassword }) {
    const user = await User.findById(userId);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw { status: 401, message: "Old password is incorrect" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
  },

  // Delete user
  async deleteUser(userId, password) {
    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw { status: 401, message: "Incorrect password" };
    }

    await User.findByIdAndDelete(userId);
  },

  // Verify email
  async verifyEmail({ username, code }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (user.isVerified) {
      throw { status: 400, message: "User already verified" };
    }

    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < Date.now()) {
      throw { status: 400, message: "Verification code expired" };
    }

    if (user.emailVerificationCode !== code) {
      throw { status: 400, message: "Incorrect code" };
    }

    user.isVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpiry = null;

    await user.save();
  },

  // Resend verification code
  async resendVerification(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (user.isVerified) {
      throw { status: 400, message: "User already verified" };
    }

    const newCode = generateVerificationCode();
    user.emailVerificationCode = newCode;
    user.emailVerificationExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(user.email, "New verification code", `Code: ${newCode}`);
  },

  // Send friend request
  async sendFriendRequest(myId, targetId) {
    if (myId === targetId) {
      throw { status: 400, message: "You cannot friend yourself" };
    }

    const me = await User.findById(myId);
    const target = await User.findById(targetId);

    if (!target) {
      throw { status: 404, message: "User not found" };
    }

    if (me.friends.includes(targetId)) {
      throw { status: 400, message: "Already friends" };
    }

    if (me.friendRequestsSent.includes(targetId)) {
      throw { status: 400, message: "Request already sent" };
    }

    me.friendRequestsSent.push(targetId);
    target.friendRequestsReceived.push(myId);

    await me.save();
    await target.save();
  },

  // Accept friend request
  async acceptFriendRequest(myId, fromId) {
    const me = await User.findById(myId);
    const from = await User.findById(fromId);

    if (!from) {
      throw { status: 404, message: "User not found" };
    }

    if (!me.friendRequestsReceived.includes(fromId)) {
      throw { status: 400, message: "No request from this user" };
    }

    me.friends.push(fromId);
    from.friends.push(myId);

    me.friendRequestsReceived = me.friendRequestsReceived.filter(
      (id) => id.toString() !== fromId
    );
    from.friendRequestsSent = from.friendRequestsSent.filter(
      (id) => id.toString() !== myId
    );

    await me.save();
    await from.save();
  },

  // Reject friend request
  async rejectFriendRequest(myId, fromId) {
    const me = await User.findById(myId);
    const from = await User.findById(fromId);

    if (!from) {
      throw { status: 404, message: "User not found" };
    }

    me.friendRequestsReceived = me.friendRequestsReceived.filter(
      (id) => id.toString() !== fromId
    );
    from.friendRequestsSent = from.friendRequestsSent.filter(
      (id) => id.toString() !== myId
    );

    await me.save();
    await from.save();
  },

  // Cancel sent friend request
  async cancelFriendRequest(myId, targetId) {
    const me = await User.findById(myId);
    const target = await User.findById(targetId);

    me.friendRequestsSent = me.friendRequestsSent.filter(
      (id) => id.toString() !== targetId
    );
    target.friendRequestsReceived = target.friendRequestsReceived.filter(
      (id) => id.toString() !== myId
    );

    await me.save();
    await target.save();
  },

  // Remove friend
  async removeFriend(myId, friendId) {
    const me = await User.findById(myId);
    const friend = await User.findById(friendId);

    me.friends = me.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== myId);

    await me.save();
    await friend.save();
  },

  // Get public profile
  async getPublicProfile(userId) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("friends", "username profilePicture");

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return user;
  },
};

module.exports = userService;
