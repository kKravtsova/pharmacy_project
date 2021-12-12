import { DataTypes } from 'sequelize';

const roleModel = (sequelize) => {
  sequelize.define(
    'role',
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
      tableName: 'roles',
    }
  );

  sequelize.models.role.hasMany(sequelize.models.user, {
    foreignKey: 'roleId',
    constraints: false,
  });

  sequelize.models.user.belongsTo(sequelize.models.role, {
    foreignKey: 'roleId',
    constraints: false,
    as: 'role',
  });
};

export default roleModel;
