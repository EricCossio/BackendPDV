export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.log("ERROR EN VALIDACIÓN:", error);

    const issues = error.issues;

    // Si no tiene issues, NO intentes usar .map
    if (!issues) {
      return res.status(400).json({
        message: ["Error de validación desconocido"],
      });
    }

    return res.status(400).json({
      message: issues.map((e) => e.message),
    });
  }
};
