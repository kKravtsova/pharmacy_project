import { DataTypes } from 'sequelize';

const deliveryModel = (sequelize) => {
  sequelize.define(
    'delivery',
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
      tableName: 'deliveries',
    }
  );

  sequelize.models.delivery.hasMany(sequelize.models.order, {
    foreignKey: 'deliveryId',
    constraints: false,
  });

  sequelize.models.order.belongsTo(sequelize.models.delivery, {
    foreignKey: 'deliveryId',
    constraints: false,
    as: 'delivery',
  });
};

export default deliveryModel;
