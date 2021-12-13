import express from 'express';
import sequelize from '../sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  res.send((await sequelize.models.delivery.findAll()).map((d) => d.get()));
});

export default router;
