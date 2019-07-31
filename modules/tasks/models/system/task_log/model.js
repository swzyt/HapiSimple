
module.exports = function (sequelize, DataTypes) {
  const SystemTaskLog = sequelize.define('SystemTaskLog', {
    task_log_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: "任务日志id"
    },
    start_time: {
      type: DataTypes.DATE(),
      allowNull: false,
      comment: "开始时间"
    },
    end_time: {
      type: DataTypes.DATE(),
      allowNull: false,
      comment: "结束时间"
    },
    next_time: {
      type: DataTypes.DATE(),
      allowNull: true,
      comment: "下次执行时间"
    },
    content: {
      type: DataTypes.TEXT(),
      allowNull: false,
      comment: "日志内容"
    },
  }, {
      tableName: 'system_task_logs',
      timestamps: true,//自动添加时间戳createAt，updateAt
      underscored: true,
      classMethods: {
        associate: function (models) {
          SystemTaskLog.belongsTo(models.SystemTask, {
            as: "logs",
            foreignKey: 'task_id'
          });
        }
      }
    });

  return SystemTaskLog;
};