module.exports = (sequelize, DataTypes) => {
  const Seller = sequelize.define(
    "Seller",
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
      store_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "non-active"],
        allowNull: false,
        defaultValue: "non-active",
      },
      verification_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_sent_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      courier: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_holder: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false,
      },
    },
    {
      tableName: "sellers",
      timestampts: true,
    }
  );

  return Seller;
};
