const Blog = require('../models/blogModel');
const Comment = require('../models/commentModel');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('comments');
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.getAcceptedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'accepted' }).populate('comments');
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('comments');
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newBlog = await Blog.create({ title, content, author });
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBlog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.approveBlog = async (req, res) => {
    try {
      // Find the blog post by ID
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      
      // Check the current status of the blog post
      if (blog.status !== 'pending') {
        return res.status(400).json({ success: false, error: 'Blog post is not pending approval or has already been handled' });
      }
      
      // Update the status of the blog post to 'accepted'
      blog.status = 'accepted';
      await blog.save();
      
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
