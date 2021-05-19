module.exports = (sequelize, DataTypes) => {
    const PaymentLog = sequelize.define(
      "PaymentLog",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        order_code: {
            type: DataTypes.STRING
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
        tableName: "payment_log",
        timestampts: true,
      }
    );
  
    return PaymentLog;
  };
  