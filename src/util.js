import jwt from 'jsonwebtoken';
import config from './config';
const getToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || 'client',
    },
    config.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decode;
      return next();
    });
  } else {
    return res.status(401).send({ message: 'Token is not supplied.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(401).send({ message: 'Admin Token is not valid.' });
};

const isPackeger = (req, res, next) => {
  if (req.user && (req.user.role === 'packeger' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(401).send({ message: 'Admin Token is not valid.' });
};

export { getToken, isAuth, isAdmin, isPackeger };
