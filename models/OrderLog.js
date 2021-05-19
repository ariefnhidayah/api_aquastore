module.exports = (sequelize, DataTypes) => {
  const OrderLog = sequelize.define(
    "OrderLog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      raw_response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "order_logs",
      timestampts: true,
    }
  );

  return OrderLog;
};
