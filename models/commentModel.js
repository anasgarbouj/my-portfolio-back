const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  name: {
    type: String,
    required: function() { return this.isNew; } // Required only on creation
  },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
