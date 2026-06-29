/* ========================================
 * utils/constants.js — 全局常量
 * 参考: design-tokens, yiji-recommendation
 * ======================================== */

/* ---- 天干地支 ---- */
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/* ---- 五行映射 (天干 -> 五行) ---- */
const WU_XING_MAP = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/* ---- 月柱查表 (月支 + 年干 -> 月柱) ---- */
const YUE_ZHU_TABLE = [
  // [月支, 甲己, 乙庚, 丙辛, 丁壬, 戊癸]
  ['寅', '丙寅', '戊寅', '庚寅', '壬寅', '甲寅'],  // 1月
  ['卯', '丁卯', '己卯', '辛卯', '癸卯', '乙卯'],  // 2月
  ['辰', '戊辰', '庚辰', '壬辰', '甲辰', '丙辰'],  // 3月
  ['巳', '己巳', '辛巳', '癸巳', '乙巳', '丁巳'],  // 4月
  ['午', '庚午', '壬午', '甲午', '丙午', '戊午'],  // 5月
  ['未', '辛未', '癸未', '乙未', '丁未', '己未'],  // 6月
  ['申', '壬申', '甲申', '丙申', '戊申', '庚申'],  // 7月
  ['酉', '癸酉', '乙酉', '丁酉', '己酉', '辛酉'],  // 8月
  ['戌', '甲戌', '丙戌', '戊戌', '庚戌', '壬戌'],  // 9月
  ['亥', '乙亥', '丁亥', '己亥', '辛亥', '癸亥'],  // 10月
  ['子', '丙子', '戊子', '庚子', '壬子', '甲子'],  // 11月
  ['丑', '丁丑', '己丑', '辛丑', '癸丑', '乙丑'],  // 12月
];

/* ---- 五行 -> 宜忌推荐 ---- */
const WU_XING_YIJI = {
  '金': {
    yi: [
      { name: '读书', icon: '📖', habits: ['阅读', '读书'] },
      { name: '静坐', icon: '🧘', habits: ['冥想', '静坐', '打坐'] },
      { name: '复盘', icon: '✍️', habits: ['日记', '复盘', '写作'] },
    ],
    ji: [
      { name: '冲动决策', icon: '⚡', habits: [] },
    ],
  },
  '木': {
    yi: [
      { name: '运动', icon: '🏃', habits: ['跑步', '晨跑', '运动', '健身'] },
      { name: '写作', icon: '✍️', habits: ['写作', '日记'] },
      { name: '规划', icon: '📋', habits: ['计划', '规划'] },
    ],
    ji: [
      { name: '过度劳累', icon: '😫', habits: [] },
    ],
  },
  '水': {
    yi: [
      { name: '社交', icon: '💬', habits: ['社交', '沟通'] },
      { name: '学习', icon: '📚', habits: ['学习', '阅读'] },
      { name: '创作', icon: '🎨', habits: ['创作', '写作'] },
    ],
    ji: [
      { name: '熬夜', icon: '🌙', habits: [] },
    ],
  },
  '火': {
    yi: [
      { name: '执行', icon: '✅', habits: ['行动', '任务'] },
      { name: '整理', icon: '📦', habits: ['整理', '收纳'] },
      { name: '沟通', icon: '💬', habits: ['沟通', '社交'] },
    ],
    ji: [
      { name: '急躁行事', icon: '🔥', habits: [] },
    ],
  },
  '土': {
    yi: [
      { name: '反思', icon: '🤔', habits: ['冥想', '日记', '复盘'] },
      { name: '修养', icon: '🧘', habits: ['静坐', '休息'] },
      { name: '规划', icon: '📋', habits: ['计划', '规划'] },
    ],
    ji: [
      { name: '拖延', icon: '🐌', habits: [] },
    ],
  },
};

/* ---- 连续天数中文称号 ---- */
const STREAK_TITLES = {
  7: '一周有成',
  21: '三周之功',
  30: '一月之期',
  100: '百日筑基',
  365: '周而复始',
};

/* ---- 称号经验值奖励 ---- */
const STREAK_EXP_REWARDS = {
  7: 50,
  21: 200,
  100: 1000,
};

/* ---- 任务优先级 ---- */
const PRIORITY = {
  HIGH: 'high',
  MID: 'mid',
  LOW: 'low',
};

const PRIORITY_LABEL = {
  high: '重要',
  mid: '普通',
  low: '不急',
};

/* ---- 分类 ---- */
const CATEGORIES = ['生活', '工作', '学习', '健康'];

/* ---- 习惯频率 ---- */
const FREQUENCY_TYPES = ['daily', 'weekday', 'custom'];

/* ---- 经验值 ---- */
const EXP_PER_TASK = 10;
const EXP_PER_CHECKIN = 5;

/* ---- 时段问候 ---- */
function getGreeting(hour) {
  if (hour < 6) return '夜深了';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
}

module.exports = {
  TIAN_GAN,
  DI_ZHI,
  SHENG_XIAO,
  WU_XING_MAP,
  YUE_ZHU_TABLE,
  WU_XING_YIJI,
  STREAK_TITLES,
  STREAK_EXP_REWARDS,
  PRIORITY,
  PRIORITY_LABEL,
  CATEGORIES,
  FREQUENCY_TYPES,
  EXP_PER_TASK,
  EXP_PER_CHECKIN,
  getGreeting,
};
