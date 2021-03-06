import { Sequelize } from 'sequelize';
import userModel from './models/userModel';
import productModel from './models/productModel';
import orderModel from './models/orderModel';
import categoryModel from './models/categoryModel';
import deliveryModel from './models/deliveryModel';
import roleModel from './models/roleModel';
import config from './config';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const sequelize = new Sequelize(
  config.PG_DATABASE,
  config.PG_USER,
  config.PG_PASSWORD,
  {
    host: config.PG_HOST,
    port: config.PG_PORT,
    dialect: 'postgres',
  }
);

categoryModel(sequelize);
userModel(sequelize);
productModel(sequelize);
orderModel(sequelize);
deliveryModel(sequelize);
roleModel(sequelize);

const setUpDatabase = async () => {
  console.log('Starting setting up');
  const statuses = [
    { name: 'In progress' },
    { name: 'Ready' },
    { name: 'Taken' },
    { name: 'Canceled' },
  ];
  const categories = [
    { name: 'Medicaments' },
    { name: 'Vitamins' },
    { name: 'Devices' },
  ];
  const roles = [
    { id: 0, name: 'client' },
    { id: 1, name: 'packeger' },
    { id: 2, name: 'admin' },
  ];
  const deliveries = [
    { id: 0, name: 'Nova Poshta' },
    { id: 1, name: 'Justin' },
  ];
  const password = bcrypt.hashSync('12345678', 8);

  await Promise.all([
    ...statuses.map((status) =>
      sequelize.models.orderStatus.findOrCreate({
        where: status,
        defaults: status,
      })
    ),
    ...categories.map((category) =>
      sequelize.models.category.findOrCreate({
        where: category,
        defaults: category,
      })
    ),
    ...deliveries.map((delivery) =>
      sequelize.models.delivery.findOrCreate({
        where: delivery,
        defaults: delivery,
      })
    ),
    ...roles.map((role) =>
      sequelize.models.role.findOrCreate({
        where: role,
        defaults: role,
      })
    ),
    sequelize.models.user.findOrCreate({
      where: { email: 'admin@admin.com' },
      defaults: {
        id: uuid(),
        name: 'Main',
        surname: 'Admin',
        email: 'admin@admin.com',
        birthDate: '2013-01-01T22:00:00.000Z',
        password,
        roleId: 2,
      },
    }),
  ]);
};

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PG');
    return sequelize.sync({ force: true });
  })
  .then(() => {
    console.log('Sync complite');
    return setUpDatabase();
  })
  .then(() => console.log('Data preset ready'))
  .catch((e) => console.error(e));

export default sequelize;
