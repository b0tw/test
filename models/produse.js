module.exports = (sequelize, DataTypes) => {
    return sequelize.define("produse", {
        denumire: {
            type: DataTypes.STRING
        },
        specificatiiMinime: {
            type: DataTypes.STRING
        },
        pret: {
            type: DataTypes.INTEGER
        },
        descriere: {
            type: DataTypes.TEXT
        },
        poza: {
            type: DataTypes.STRING
        },
        eActivat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { updatedAt: false, createdAt: false })
}