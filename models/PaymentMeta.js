module.exports = (sequelize, DataTypes) => {
    const PaymentMeta = sequelize.define(
      "PaymentMeta",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        data: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        type: {
          type: DataTypes.TEXT,
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
        tableName: "payment_meta",
        timestampts: true,
      }
    );
  
    return PaymentMeta;
  };
  