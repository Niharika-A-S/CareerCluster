const { validationResult } = require('express-validator');
const { fail } = require('../utils/apiResponse');

function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(
      fail('Validation error', 422, {
        errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
      })
    );
  }
  return next();
}

module.exports = { validate };

