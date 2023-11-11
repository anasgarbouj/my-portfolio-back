const Comment = require('../models/commentModel');
const Blog = require('../models/blogModel');

exports.createComment = async (req, res) => {
  try {
    const { content, name, blogId } = req.body;  // Destructure name from req.body

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    // Create the new comment with name and content
    const comment = await Comment.create({ content, name, blog: blogId });

    // Push the new comment's ID to the blog's comments array
    blog.comments.push(comment._id);
    await blog.save(); // Save the updated blog document

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getCommentsForBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.approveComment = async (req, res) => {
  try {
    const { status } = req.body;
    const commentId = req.params.commentId;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const result = await Comment.deleteOne({ _id: req.params.commentId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// Additional controllers can be added for things like updating comments if needed.
