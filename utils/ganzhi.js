/* ========================================
 * utils/ganzhi.js — 天干地支计算
 * 参考: openspec/specs/yiji-recommendation.md
 * ======================================== */

const { TIAN_GAN, DI_ZHI, SHENG_XIAO, WU_XING_MAP, YUE_ZHU_TABLE, WU_XING_YIJI } = require('./constants');

// 尝试加载预置日柱数据（随小程序打包）
let dailyGanzhiData = {};
try {
  dailyGanzhiData = require('../assets/data/daily-ganzhi.json');
} catch (e) {
  // 数据文件未就绪，回退到公式计算
}

/**
 * 计算年柱
 * 公式: 年干 = (year - 4) % 10, 年支 = (year - 4) % 12
 * @param {number} year
 * @returns {{ gan: string, zhi: string, ganzhi: string, shengxiao: string }}
 */
function calcYearPillar(year) {
  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganzhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    shengxiao: SHENG_XIAO[zhiIdx],
  };
}

/**
 * 计算月柱（按年干 + 公历月份查表）
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {{ gan: string, zhi: string, ganzhi: string }}
 */
function calcMonthPillar(year, month) {
  const { gan: yearGan } = calcYearPillar(year);
  // 年干分组: 甲己=0, 乙庚=1, 丙辛=2, 丁壬=3, 戊癸=4
  const yearGanGroup = TIAN_GAN.indexOf(yearGan) % 5;
  const yueZhu = YUE_ZHU_TABLE[month - 1][yearGanGroup + 1];
  return {
    gan: yueZhu[0],
    zhi: yueZhu[1],
    ganzhi: yueZhu,
  };
}

/**
 * 计算日柱（优先查表，回退公式）
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {{ gan: string, zhi: string, ganzhi: string }}
 */
function calcDayPillar(dateStr) {
  // 优先从预置数据查表
  if (dailyGanzhiData[dateStr]) {
    const { gan, zhi } = dailyGanzhiData[dateStr];
    return {
      gan: TIAN_GAN[gan],
      zhi: DI_ZHI[zhi],
      ganzhi: TIAN_GAN[gan] + DI_ZHI[zhi],
    };
  }

  // 回退: 使用公式近似计算
  // 以已知基准日 2025-10-15 = 庚申日 (ganIdx=6, zhiIdx=8) 为锚点
  return calcDayPillarFallback(dateStr);
}

/**
 * 日柱回退计算（以 2025-10-15 庚申日为基准）
 * @param {string} dateStr
 * @returns {{ gan: string, zhi: string, ganzhi: string }}
 */
function calcDayPillarFallback(dateStr) {
  const anchor = new Date(2025, 9, 15); // 2025-10-15 庚申日 ganIdx=6 zhiIdx=8
  const target = new Date(dateStr);
  const diffDays = Math.round((target - anchor) / (1000 * 60 * 60 * 24));

  const ganIdx = ((6 + diffDays) % 10 + 10) % 10;
  const zhiIdx = ((8 + diffDays) % 12 + 12) % 12;

  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganzhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
  };
}

/**
 * 根据日干获取五行属性
 * @param {string} dayGan - 天干字符
 * @returns {string} 五行属性 '金'|'木'|'水'|'火'|'土'
 */
function getWuxing(dayGan) {
  return WU_XING_MAP[dayGan] || '土';
}

/**
 * 根据五行获取今日宜忌推荐
 * @param {string} wuxing
 * @param {Array<{name: string}>} [userHabits] - 用户习惯列表
 * @returns {{ yi: Array, ji: Array }}
 */
function getYiji(wuxing, userHabits) {
  const yiji = WU_XING_YIJI[wuxing] || WU_XING_YIJI['土'];
  const habitNames = (userHabits || []).map(h => h.name);

  // 宜事项：最多3项，优先匹配用户习惯
  const yi = yiji.yi.map(item => ({
    ...item,
    matched: item.habits.some(h => habitNames.includes(h)),
  })).sort((a, b) => b.matched - a.matched).slice(0, 3);

  // 忌事项：最多2项
  const ji = yiji.ji.slice(0, 2);

  return { yi, ji };
}

/**
 * 获取完整干支五行信息
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {{ yearPillar, monthPillar, dayPillar, wuxing, ganzhiDisplay }}
 */
function getFullGanzhi(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  const yearPillar = calcYearPillar(y);
  const monthPillar = calcMonthPillar(y, m);
  const dayPillar = calcDayPillar(dateStr);
  const wuxing = getWuxing(dayPillar.gan);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    wuxing,
    // 显示格式: "庚申日 · 金旺"
    ganzhiDisplay: `${dayPillar.ganzhi}日 · ${wuxing}旺`,
  };
}

module.exports = {
  calcYearPillar,
  calcMonthPillar,
  calcDayPillar,
  getWuxing,
  getYiji,
  getFullGanzhi,
};
