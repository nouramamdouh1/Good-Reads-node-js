const validate = (validationRules) => {
  return async (req, res, next) => {
    for (let validation of validationRules) {
      const result = await validation.run(req);
      if (result.errors.length) {
        const extractedErrors = [];
        result.errors
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));
        return res.status(422).json({
          status: "fail",
          errors: extractedErrors,
        });
      }
    }
    return next();
  };
};

module.exports = {
  validate,
};
