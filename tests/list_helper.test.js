const listHelper = require('../utils/list_helper');
const { dummyBlogs } = require('./test_helper');

test('dummy returns one', () => {
  const result = listHelper.dummy([]);
  expect(result).toBe(1);
});

describe('total likes', () => {
  const listWithOneBlog = [dummyBlogs[1]];

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});
describe('favourite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toEqual(null);
  });
  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(dummyBlogs);
    expect(result).toEqual(dummyBlogs[2]);
  });
});
describe('author with most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toEqual(null);
  });
  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(dummyBlogs);
    const right = {
      author: 'Robert C. Martin',
      blogs: 3
    };
    expect(result).toEqual(right);
  });
});
describe('author with most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toEqual(null);
  });
  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(dummyBlogs);
    const right = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    };
    expect(result).toEqual(right);
  });
});
