'use strict';

const { validationResult } = require('express-validator');

/**
 * Validate the request using express-validator middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns error messages
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};
exports.default = validateRequest;
