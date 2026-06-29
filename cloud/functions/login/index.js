/* cloud/functions/login/index.js */
/* 登录云函数 — 获取用户 openid */

const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext();

  return {
    openid: OPENID,
    appid: APPID,
  };
};
