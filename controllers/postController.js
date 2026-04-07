const mongoose = require("mongoose");
const Post = require("../models/Post");
const Group = require("../models/Group");
const { uploadPostImage } = require("../utils/imagekitUpload");

exports.createPost = async (req, res) => {
  try {
    const { title, content, group } = req.body;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Please upload at least one image" });
    }

    let groupId = null;
    if (group) {
      if (!mongoose.Types.ObjectId.isValid(group)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid group id" });
      }

      const foundGroup = await Group.findById(group);
      if (!foundGroup) {
        return res
          .status(404)
          .json({ status: "error", message: "Group not found" });
      }

      const isSuperAdmin = req.user.role === "super-admin";
      const isGroupAdmin = foundGroup.admins.some(
        (id) => id.toString() === req.user._id.toString(),
      );
      const canPost = foundGroup.permissions.canPost.some(
        (id) => id.toString() === req.user._id.toString(),
      );

      if (!isSuperAdmin && !isGroupAdmin && !canPost) {
        return res
          .status(403)
          .json({
            status: "error",
            message: "You do not have permission to post in this group",
          });
      }

      groupId = foundGroup._id;
    }

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadPostImage(file)),
    );

    const post = await Post.create({
      title,
      content,
      images: imageUrls,
      author: req.user._id,
      group: groupId,
    });

    res.status(201).json({ status: "success", data: post });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    if (!req.user) {
      const posts = await Post.find({ group: null })
        .populate("author", "username email role")
        .populate("group", "name")
        .sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ status: "success", results: posts.length, data: posts });
    }

    if (req.user.role === "super-admin") {
      const allPosts = await Post.find()
        .populate("author", "username email role")
        .populate("group", "name")
        .sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ status: "success", results: allPosts.length, data: allPosts });
    }

    const groups = await Group.find({ members: req.user._id }).select("_id");
    const groupIds = groups.map((g) => g._id);

    const posts = await Post.find({
      $or: [{ group: null }, { group: { $in: groupIds } }],
    })
      .populate("author", "username email role")
      .populate("group", "name")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ status: "success", results: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username email role")
      .populate("group", "name")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ status: "success", results: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === "super-admin";
    if (!isOwner && !isSuperAdmin) {
      return res
        .status(403)
        .json({ status: "error", message: "Not allowed to update this post" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === "super-admin";
    if (!isOwner && !isSuperAdmin) {
      return res
        .status(403)
        .json({ status: "error", message: "Not allowed to delete this post" });
    }

    await post.deleteOne();
    res
      .status(200)
      .json({ status: "success", message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
