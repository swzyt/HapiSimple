
module.exports = function (sequelize, DataTypes) {
  const SystemApp = sequelize.define('SystemApp', {
    app_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: "应用标识id"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "应用名称"
    },
    secret: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "应用密钥"
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "描述"
    }
  }, {
      tableName: 'system_apps',
      timestamps: true,//自动添加时间戳createAt，updateAt
      underscored: true,
      classMethods: {
        associate: function (models) {
        }
      }
    });

  return SystemApp;
};
