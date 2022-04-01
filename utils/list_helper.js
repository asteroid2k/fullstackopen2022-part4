const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  return blogs.reduce((total, curr) => total + curr.likes, 0);
};
const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (liked, blog) => (liked.likes > blog.likes ? liked : blog),
    {}
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
