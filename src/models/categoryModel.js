import { DataTypes } from 'sequelize';

const categoryModel = (sequelize) => {
  sequelize.define(
    'category',
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
      tableName: 'categories',
    }
  );
};

export default categoryModel;
