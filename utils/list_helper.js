let collection = require('lodash/collection');

const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  return blogs.reduce((total, curr) => total + curr.likes, 0);
};
const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return null;
  }
  return blogs.reduce(
    (liked, blog) => (liked.likes > blog.likes ? liked : blog),
    {}
  );
};
const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null;
  }
  const counts = collection.countBy(blogs, 'author');
  return getMaxKey(counts, 'author', 'blogs');
};

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null;
  }
  const likeCounts = {};
  blogs.forEach((blog) => {
    likeCounts[blog.author] = isNaN(likeCounts[blog.author])
      ? blog.likes
      : likeCounts[blog.author] + blog.likes;
  });
  return getMaxKey(likeCounts, 'author', 'likes');
};

const getMaxKey = (arr, keyName, valueName) => {
  const key = Object.keys(arr).reduce((a, b) => (arr[a] > arr[b] ? a : b), {});
  const result = {};
  result[keyName] = key;
  result[valueName] = arr[key];
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
