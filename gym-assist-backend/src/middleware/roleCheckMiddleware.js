const roleCheckMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // Assumimos que o authMiddleware já rodou e anexou req.user
    const userRole = req.user?.role;

    if (userRole && userRole === requiredRole) {
      next(); // Permissão concedida, continua para o controlador
    } else {
      res
        .status(403)
        .json({ message: "Acesso proibido. Permissões insuficientes." }); // 403 Forbidden
    }
  };
};

module.exports = roleCheckMiddleware;
