/* cloud/functions/sync-data/index.js */
/* 数据同步云函数 */

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { action, collection, data } = event;

  switch (action) {
    case 'pull':
      return await pullData(OPENID);
    case 'push':
      return await pushData(OPENID, collection, data);
    default:
      return { error: '未知操作' };
  }
};

async function pullData(openid) {
  const [tasks, habits, records] = await Promise.all([
    db.collection('tasks').where({ userId: openid }).get(),
    db.collection('habits').where({ userId: openid }).get(),
    db.collection('records').where({ userId: openid }).get(),
  ]);
  return { tasks: tasks.data, habits: habits.data, records: records.data };
}

async function pushData(openid, collection, data) {
  // 简易同步：按 openid + id 更新
  const res = await db.collection(collection).where({
    userId: openid,
    id: data.id,
  }).get();

  if (res.data.length > 0) {
    await db.collection(collection).doc(res.data[0]._id).update({ data });
  } else {
    await db.collection(collection).add({ data: { ...data, userId: openid } });
  }
  return { success: true };
}
