/**
 * Redirige HTTP a HTTPS en producción.
 * Útil cuando la app está detrás de un proxy (Render, nginx) que termina TLS.
 * El proxy envía X-Forwarded-Proto: https cuando la petición original era HTTPS.
 */
export const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();

  const proto = req.get('X-Forwarded-Proto') || req.protocol;
  if (proto === 'https') return next();

  const host = req.get('Host') || req.hostname;
  return res.redirect(301, `https://${host}${req.originalUrl}`);
};
