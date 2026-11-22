const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nmnora_secure_jwt_secret_key_2026_super_protected';

// Middleware to optionally extract user if token is provided
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded; // { id, email, role, name }
    }
    next();
  });
};

// Middleware requiring any logged-in user
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    req.user = decoded;
    next();
  });
};

// Strict Admin-only middleware (Never trust client; verify role on server)
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in to admin portal.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access denied. Administrator privileges required. You do not have permission to perform this operation.'
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireAuth,
  requireAdmin,
};
