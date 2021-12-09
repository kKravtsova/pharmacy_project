import express from 'express';
import sequelize from '../sequelize';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { ClientError, ErrorMessages } from '../utils/clientErrors';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

router.get('/', async (req, res) => {
  const { searchKeyword, sortOrder, category } = req.query;

  try {
    const conditions = {
      include: [
        {
          model: sequelize.models.category,
          as: 'category',
        },
      ],
      where: {},
    };

    if (category) {
      conditions.where['$category.name$'] = category;
    }

    if (sortOrder) {
      conditions.order = [
        sortOrder === 'lowest' ? ['price', 'ASC'] : ['price', 'DESC'],
      ];
    }

    if (searchKeyword) {
      conditions.where.title = {
        [Op.like]: `%${searchKeyword}%`,
      };
    }
    const products = (await sequelize.models.product.findAll(conditions)).map(
      (el) => el.get({ plain: true })
    );

    return res.send(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ code: 500, message: ErrorMessages.INTERNAL });
  }
});

router.get('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    if (!productId) throw new ClientError();

    const productRef = await sequelize.models.product.findByPk(productId, {
      include: [
        sequelize.models.review,
        {
          model: sequelize.models.category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    if (!productRef) throw new ClientError(ErrorMessages.NO_PRODUCT, 404);

    res.send(productRef.get({ plain: true }));
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

router.post('/:id/reviews', isAuth, async (req, res) => {
  const productId = req.params.id;
  try {
    if (!productId) throw new ClientError();

    const reviewRef = await sequelize.models.review.create({
      id: uuid(),
      title: req.body.title ?? '',
      rating: Number(req.body.rating),
      comment: req.body.comment ?? '',
      productId,
    });

    const productRef = await sequelize.models.product.findByPk(productId, {
      include: [sequelize.models.review],
    });

    const product = productRef.get();

    const numReviews = product.reviews.length;
    const rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;

    await productRef.update({
      numReviews,
      rating,
    });

    return res.status(201).send({
      data: reviewRef.get(),
      message: 'Review saved successfully.',
    });
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

router.put('/:id', isAuth, isAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    if (!productId) throw new ClientError();

    const productRef = await sequelize.models.product.findByPk(productId);

    if (!productRef) throw new ClientError(ErrorMessages.NO_PRODUCT, 404);

    const updates = {
      title: req.body.title,
      price: req.body.price,
      countInStock: req.body.countInStock,
      description: req.body.description,
      categoryId: Number(req.body.category),
    };
    if (req.body.imagePath) updates.imagePath = req.body.image;
    const updatedProduct = await productRef.update(updates);

    return res
      .status(200)
      .send({ message: 'Product Updated', data: updatedProduct.get() });
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
  const productId = req.params.id;
  try {
    if (!productId) throw new ClientError();

    const productRef = await sequelize.models.product.findByPk(productId);

    if (!productRef) throw new ClientError(ErrorMessages.NO_PRODUCT, 404);

    await productRef.destroy();

    return res.send({ message: 'Product Deleted' });
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

router.post('/', isAuth, isAdmin, async (req, res) => {
  try {
    const newProductRef = await sequelize.models.product.create({
      id: uuid(),
      title: req.body.title,
      price: req.body.price,
      imagePath: req.body.image,
      countInStock: req.body.countInStock,
      description: req.body.description,
      categoryId: Number(req.body.category) || 0,
    });

    const newProduct = newProductRef.get();
    if (!newProduct) throw new Error();

    return res
      .status(201)
      .send({ message: 'New Product Created', data: newProduct });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: ' Error in Creating Product.' });
  }
});

export default router;
