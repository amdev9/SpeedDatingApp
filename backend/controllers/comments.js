import Comment from '../models/comment';

// User relation for .populate()
const userRelation = {
  path: 'user',
  select: ['name', 'avatar'],
  model: 'User',
};

// List existing comments
export const list = async (req, res, next) => {
  // Get all comments and populate User models
  const comments = await Comment.find()
    .sort({ 'created': -1 })
    .populate(userRelation)
    .exec();

  res.json({
    comments
  });
};

// Create new comment
export const create = async (req, res, next) => {
  const { user_id, content } = req.body;
  // Save comment
  const comment = await new Comment({
    user: user_id,
    content: content,
    created: new Date,
  }).save();

  res.json({
    // Get the comment and populate User model
    comment: await Comment.findById(comment._id)
      .populate(userRelation)
      .exec()
  });
};
