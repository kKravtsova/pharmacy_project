import { DataTypes } from 'sequelize';

const productModel = (sequelize) => {
  sequelize.define(
    'product',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      imagePath: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      countInStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'products',
    }
  );

  sequelize.define(
    'review',
    {
      // The following specification of the 'id' attribute could be omitted
      // since it is the default.
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comment: {
        type: DataTypes.STRING,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'reviews',
    }
  );

  sequelize.models.product.hasMany(sequelize.models.review, {
    foreignKey: 'productId',
    constraints: false,
  });
  sequelize.models.review.belongsTo(sequelize.models.product, {
    foreignKey: 'productId',
    constraints: false,
    as: 'review',
  });

  sequelize.models.category.hasMany(sequelize.models.product, {
    foreignKey: 'categoryId',
    constraints: false,
  });
  sequelize.models.product.belongsTo(sequelize.models.category, {
    foreignKey: 'categoryId',
    constraints: false,
    as: 'category',
  });
};

export default productModel;
