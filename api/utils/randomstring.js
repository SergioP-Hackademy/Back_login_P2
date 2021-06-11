const randomString = async (num) => {
  return Math.random().toString(36).substring(2, num + 2);
};

module.exports = randomString;
