module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    "Province",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "provincies",
    }
  );

  return Province;
};
