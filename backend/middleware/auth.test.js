import { describe, it, expect, beforeAll, vi } from 'vitest';
import jwt from 'jsonwebtoken';

const SECRET = 'test-secret-de-al-menos-32-caracteres-ok';
let authenticateIf, optionalAuth;

beforeAll(async () => {
  // auth.js lee JWT_SECRET al importarse
  process.env.JWT_SECRET = SECRET;
  ({ authenticateIf, optionalAuth } = await import('./auth.js'));
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};
const reqCon = (token, query = {}) => ({
  query,
  headers: token ? { authorization: `Bearer ${token}` } : {}
});

describe('authenticateIf', () => {
  const soloOcultos = (req) => req.query.incluir_ocultos === 'true';

  it('deja pasar sin token cuando no se piden datos ocultos', () => {
    const next = vi.fn();
    authenticateIf(soloOcultos)(reqCon(null), mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('responde 401 si se piden datos ocultos sin token', () => {
    const next = vi.fn();
    const res = mockRes();
    authenticateIf(soloOcultos)(reqCon(null, { incluir_ocultos: 'true' }), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('responde 403 con token inválido, para que el frontend renueve el token', () => {
    const res = mockRes();
    authenticateIf(soloOcultos)(reqCon('basura', { incluir_ocultos: 'true' }), res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('deja pasar con token válido', () => {
    const next = vi.fn();
    const token = jwt.sign({ id: 1 }, SECRET);
    const req = reqCon(token, { incluir_ocultos: 'true' });
    authenticateIf(soloOcultos)(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe(1);
  });
});

describe('optionalAuth', () => {
  it('sigue como anónimo con token inválido', () => {
    const next = vi.fn();
    const req = reqCon('basura');
    optionalAuth(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('carga el usuario con token válido', () => {
    const req = reqCon(jwt.sign({ id: 7 }, SECRET));
    optionalAuth(req, mockRes(), vi.fn());
    expect(req.user.id).toBe(7);
  });
});
