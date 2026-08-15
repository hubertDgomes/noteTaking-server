import Post from '../model/post.js';

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user?.id;

    if (!author) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = await Post.create({
      title,
      content,
      author
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  createPost
};
