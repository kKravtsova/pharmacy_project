import express from 'express';
import sequelize from '../sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  res.send((await sequelize.models.category.findAll()).map((c) => c.get()));
});

export default router;
