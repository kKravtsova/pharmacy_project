import express from 'express';
import { getToken, isAuth, isAdmin } from '../util';
import sequelize from '../sequelize';
import bcrypt from 'bcrypt';
import { ClientError, ErrorMessages } from '../utils/clientErrors';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;

  try {
    const userRef = await sequelize.models.user.findByPk(userId);

    if (userRef && req.body.id === userRef.get().id) {
      throw new ClientError(ErrorMessages.NO_USER, 404);
    }

    await models.user.update(req.body, {
      where: {
        id: userRef.get().id,
      },
    });

    return res.sendStatus(200);
  } catch (err) {
    if (err instanceof ClientError) {
      return res
        .status(err.status)
        .json({ code: err.status, message: err.message });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: ErrorMessages.INTERNAL });
    }
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ClientError();
    }

    const userRef = await sequelize.models.user.findOne({
      where: {
        email,
      },
      include: [
        {
          model: sequelize.models.role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    });

    if (!userRef) {
      throw new ClientError(ErrorMessages.WRONG_CRED, 401);
    }

    const user = userRef.get({ plain: true });

    if (!bcrypt.compareSync(password, user.password)) {
      throw new ClientError(ErrorMessages.WRONG_CRED, 401);
    }

    console.log('USER', user);
    return res.send({
      id: user.id,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate,
      email: user.email,
      role: user.role.name,
      token: getToken(user),
    });
  } catch (err) {
    if (err instanceof ClientError) {
      return res
        .status(err.status)
        .json({ code: err.status, message: err.message });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: ErrorMessages.INTERNAL });
    }
  }
});

router.post('/register', async (req, res) => {
  try {
    const userRef = await sequelize.models.user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userRef) {
      throw new ClientError();
    }

    const password = bcrypt.hashSync(req.body.password, 8);
    const newUserRef = await sequelize.models.user.create({
      id: uuid(),
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      birthDate: new Date(req.body.birthDate),
      roleId: 0,
      password,
    });

    if (!newUserRef) throw new Error();

    const newUser = newUserRef.get();

    return res.send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      surname: newUser.surname,
      birthDate: newUser.birthDate,
      role: 'client',
      token: getToken(newUser),
    });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: 'Invalid User Data.' });
  }
});

router.post('/addpersonal', isAuth, isAdmin, async (req, res) => {
  try {
    const userRef = await sequelize.models.user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userRef) {
      throw new ClientError();
    }

    const password = bcrypt.hashSync(req.body.password, 8);
    const newUserRef = await sequelize.models.user.create({
      id: uuid(),
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      birthDate: req.body.birthDate,
      roleId: req.body.role || 0,
      password,
    });

    if (!newUserRef) throw new Error();

    const newUser = newUserRef.get();

    return res.send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      surname: newUser.surname,
      birthDate: newUser.birthDate,
      role: newUser.role,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: 'Invalid User Data.' });
  }
});

router.get('/createadmin', async (req, res) => {
  try {
    const password = bcrypt.hashSync('12345678', 8);
    const newUserRef = await sequelize.models.user.create({
      id: uuid(),
      name: 'Kate',
      surname: 'Kravtsova',
      email: 'admin@example.com',
      birthDate: '2013-01-01T22:00:00.000Z',
      password,
      role: 'admin',
    });
    res.send(newUserRef.get());
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
