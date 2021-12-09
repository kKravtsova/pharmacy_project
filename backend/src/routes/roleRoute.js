import express from 'express';
import sequelize from '../sequelize';
import { isAdmin, isAuth } from '../util';

const router = express.Router();

router.get('/', isAuth, isAdmin, async (req, res) => {
  res.send((await sequelize.models.role.findAll()).map((r) => r.get()));
});

export default router;
