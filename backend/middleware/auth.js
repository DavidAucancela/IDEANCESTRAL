import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

/**
 * Exige autenticación solo cuando `predicate(req)` es verdadero.
 * Ej.: listados públicos que piden datos ocultos con un query param.
 */
export const authenticateIf = (predicate) => (req, res, next) =>
  predicate(req) ? authenticateToken(req, res, next) : next();

/**
 * Si hay un token válido, deja el usuario en req.user; si no, sigue como anónimo.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
};
