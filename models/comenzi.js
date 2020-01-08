module.exports = (sequelize, DataTypes) => {
    return sequelize.define("comenzi", {
        name: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        noProducts: {
            type: DataTypes.INTEGER
        },
        totalSum: {
            type: DataTypes.FLOAT
        },
        date: {
            type: DataTypes.DATE
        }
    }, { updatedAt: false, createdAt: false })
}