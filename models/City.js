module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define('City', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        province: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postcode: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'cities'
    })

    return City
}