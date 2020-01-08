module.exports = (sequelize, DataTypes) => {
    return sequelize.define("recenzii", {
        recenzie: {
            type: DataTypes.STRING
        }
    }, { updatedAt: false, createdAt: false })
}