import { DataTypes } from 'sequelize';

const userModel = (sequelize) => {
  sequelize.define(
    'user',
    {
      // The following specification of the 'id' attribute could be omitted
      // since it is the default.
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          // We require usernames to have length of at least 3, and
          // only use letters, numbers and underscores.
          is: /^\w{3,}$/,
        },
      },
      surname: {
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      roleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      birthDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'users',
    }
  );
};

export default userModel;
