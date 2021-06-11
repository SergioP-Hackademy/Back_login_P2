/* eslint-disable indent */
// eslint-disable-next-line consistent-return
const middlewares = (req, res, next) => {
    // eslint-disable-next-line no-unused-expressions
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: 'Content can not be empty!' });
    }
    next();
  };
  module.exports = middlewares;
