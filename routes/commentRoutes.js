const express = require('express');
const { authenticateJWT, isAdmin } = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');
    
const router = express.Router();

router.post('/', authenticateJWT, commentController.createComment);
router.get('/for-blog/:blogId', commentController.getCommentsForBlog);
router.put('/approve/:commentId', authenticateJWT, isAdmin, commentController.approveComment);
router.delete('/:commentId', authenticateJWT, isAdmin, commentController.deleteComment);

module.exports = router;
