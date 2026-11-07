export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace with validated/coerced data
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path.join('.').replace(/^(body|query|params)\./, ''),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: formattedErrors[0]?.message || 'Validation error',
        errors: formattedErrors,
      });
    }
    next(err);
  }
};

