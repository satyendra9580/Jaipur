export function notFound(req, res, next) {
  res.status(404).json({ error: { message: 'Not Found' } });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message || 'Internal Server Error' } });
}
