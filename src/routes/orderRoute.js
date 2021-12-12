import express from 'express';
import { v4 as uuid } from 'uuid';
import sequelize from '../sequelize';
import { isAuth, isAdmin, isPackeger } from '../util';
import { ErrorMessages, ClientError } from '../utils/clientErrors';

const router = express.Router();

router.get('/', isAuth, isPackeger, async (req, res) => {
  const orders = await sequelize.models.order.findAll({
    include: [
      {
        model: sequelize.models.user,
        attributes: ['email'],
        as: 'user',
      },
      {
        model: sequelize.models.orderStatus,
        as: 'status',
      },
    ],
    attributes: ['id', 'totalPrice', 'createdAt'],
  });

  res.send(orders.map((order) => order.get({ plain: true })));
});

router.put('/status', isAuth, isPackeger, async (req, res) => {
  await sequelize.models.order.update(
    { statusId: Number(req.body.status) },
    {
      where: { id: req.body.id },
    }
  );
  res.sendStatus(200);
});

router.get('/status', isAuth, isPackeger, async (req, res) => {
  res.send((await sequelize.models.orderStatus.findAll()).map((e) => e.get()));
});

router.get('/mine', isAuth, async (req, res) => {
  const orders = await sequelize.models.order.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{ model: sequelize.models.orderStatus, as: 'status' }],
    attributes: ['id', 'totalPrice', 'createdAt'],
  });

  res.send(orders.map((order) => order.get({ plain: true })));
});

router.get('/:id', isAuth, async (req, res) => {
  try {
    const orderRef = await sequelize.models.order.findByPk(req.params.id, {
      attributes: [
        'address',
        'city',
        'postalCode',
        'itemsPrice',
        'shippingPrice',
        'taxPrice',
        'totalPrice',
      ],
      include: [
        {
          model: sequelize.models.orderPosition,
          include: [
            {
              model: sequelize.models.product,
              as: 'product',
              attributes: ['imagePath', 'id', 'title', 'price'],
            },
          ],
        },
        {
          model: sequelize.models.orderStatus,
          as: 'status',
        },
      ],
    });

    if (!orderRef) throw new ClientError(ErrorMessages.NO_ORDER, 404);

    res.send(orderRef.get({ plain: true }));
  } catch (err) {
    if (err instanceof ClientError) {
      return res
        .status(err.status)
        .json({ code: err.status, message: err.message });
    } else {
      console.log(err);
      return res
        .status(500)
        .json({ code: 500, message: ErrorMessages.INTERNAL });
    }
  }
});

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  await sequelize.models.order.destroy({
    where: { id: req.params.id },
  });
  res.send('Deleted');
});

router.post('/', isAuth, async (req, res) => {
  try {
    const order = (
      await sequelize.models.order.create({
        id: uuid(),
        userId: req.user.id,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        address: req.body.shipping.address,
        city: req.body.shipping.city,
        postalCode: req.body.shipping.postalCode,
        deliveryId: req.body.shipping.delivery.id,
      })
    ).get();

    await Promise.all([
      ...req.body.orderItems.map((position) =>
        sequelize.models.orderPosition.create({
          id: uuid(),
          orderId: order.id,
          productId: position.product,
          qty: position.qty,
        })
      ),
      ...req.body.orderItems.map((position) =>
        sequelize.models.product.decrement('countInStock', {
          by: position.qty,
          where: { id: position.product },
        })
      ),
    ]);

    return res
      .status(201)
      .send({ message: 'New Order Created', data: { id: order.id } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ code: 500, message: ErrorMessages.INTERNAL });
  }
});

export default router;
