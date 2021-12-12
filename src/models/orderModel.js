import { DataTypes } from 'sequelize';

const orderModel = (sequelize) => {
  sequelize.define(
    'order',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemsPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: { min: 0 },
      },
      taxPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: { min: 0 },
        defaultValue: 0,
      },
      shippingPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
      totalPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      postalCode: {
        type: DataTypes.STRING,
      },
      deliveryId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      statusId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'orders',
    }
  );

  sequelize.define(
    'orderPosition',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      timestamps: false,
      tableName: 'orderPositions',
    }
  );

  sequelize.define(
    'orderStatus',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'orderStatuses',
    }
  );

  sequelize.models.user.hasMany(sequelize.models.order, {
    foreignKey: 'userId',
    constraints: false,
  });

  sequelize.models.order.belongsTo(sequelize.models.user, {
    foreignKey: 'userId',
    constraints: false,
    as: 'user',
  });

  sequelize.models.orderStatus.hasMany(sequelize.models.order, {
    foreignKey: 'statusId',
    constraints: false,
  });

  sequelize.models.order.belongsTo(sequelize.models.orderStatus, {
    foreignKey: 'statusId',
    constraints: false,
    as: 'status',
  });

  sequelize.models.order.hasMany(sequelize.models.orderPosition, {
    foreignKey: 'orderId',
    constraints: false,
  });

  sequelize.models.orderPosition.belongsTo(sequelize.models.order, {
    foreignKey: 'orderId',
    constraints: false,
    as: 'orderPosition',
  });

  sequelize.models.product.hasMany(sequelize.models.orderPosition, {
    foreignKey: 'productId',
    constraints: false,
  });

  sequelize.models.orderPosition.belongsTo(sequelize.models.product, {
    foreignKey: 'productId',
    constraints: false,
    as: 'product',
  });
};

export default orderModel;
