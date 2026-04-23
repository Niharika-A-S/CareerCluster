function ok(res, payload, status = 200) {
  return res.status(status).json(payload);
}

function fail(message, statusCode = 400, extra = {}) {
  const err = new Error(message);
  err.statusCode = statusCode;
  Object.assign(err, extra);
  return err;
}

module.exports = { ok, fail };

