/* cloud/functions/export-data/index.js */
/* 数据导出云函数 */

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  const [tasks, habits, records] = await Promise.all([
    db.collection('tasks').where({ userId: OPENID }).get(),
    db.collection('habits').where({ userId: OPENID }).get(),
    db.collection('records').where({ userId: OPENID }).get(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    tasks: tasks.data,
    habits: habits.data,
    records: records.data,
  };
};
