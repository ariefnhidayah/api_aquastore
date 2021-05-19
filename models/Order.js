module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      shipping_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_plus_tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      confirm_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.ENUM,
        values: ["pending", "paid", "expired", "failed"],
        allowNull: false,
        defaultValue: "pending",
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
      snap_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      },
    },
    {
      tableName: "orders",
      timestampts: true,
    }
  );

  return Order;
};
