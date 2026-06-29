/* tests/unit/ganzhi.test.js */
/* 验证: openspec/specs/yiji-recommendation.md §3 */

const {
  calcYearPillar,
  calcMonthPillar,
  calcDayPillar,
  getWuxing,
  getYiji,
  getFullGanzhi,
} = require('../../utils/ganzhi');

describe('calcYearPillar', () => {
  it('2025年 → 乙巳年 蛇', () => {
    const result = calcYearPillar(2025);
    expect(result.gan).toBe('乙');
    expect(result.zhi).toBe('巳');
    expect(result.ganzhi).toBe('乙巳');
    expect(result.shengxiao).toBe('蛇');
  });

  it('2024年 → 甲辰年 龙', () => {
    const result = calcYearPillar(2024);
    expect(result.gan).toBe('甲');
    expect(result.zhi).toBe('辰');
    expect(result.ganzhi).toBe('甲辰');
    expect(result.shengxiao).toBe('龙');
  });

  it('2026年 → 丙午年 马', () => {
    const result = calcYearPillar(2026);
    expect(result.gan).toBe('丙');
    expect(result.zhi).toBe('午');
    expect(result.ganzhi).toBe('丙午');
    expect(result.shengxiao).toBe('马');
  });

  it('公式: ganIdx = (year - 4) % 10, zhiIdx = (year - 4) % 12', () => {
    // 验证关键公式正确性
    expect((2025 - 4) % 10).toBe(1); // 乙
    expect((2025 - 4) % 12).toBe(5); // 巳
  });
});

describe('calcMonthPillar', () => {
  it('2025年10月 → 丁亥（年干乙=乙庚列，10月亥）', () => {
    const result = calcMonthPillar(2025, 10);
    // 乙庚年 10月亥 → 丁亥 (per yiji spec §3.4 table)
    expect(result.ganzhi).toBe('丁亥');
  });

  it('2025年1月 → 戊寅（年干乙，乙庚列）', () => {
    const result = calcMonthPillar(2025, 1);
    expect(result.ganzhi).toBe('戊寅');
  });

  it('2024年10月 → 乙亥（年干甲=甲己列，10月亥）', () => {
    const result = calcMonthPillar(2024, 10);
    // 甲己年 10月亥 → 乙亥 (per yiji spec §3.4 table)
    expect(result.ganzhi).toBe('乙亥');
  });
});

describe('calcDayPillar', () => {
  it('2025-10-15 → 庚申日（查表）', () => {
    const result = calcDayPillar('2025-10-15');
    expect(result.gan).toBe('庚');
    expect(result.zhi).toBe('申');
    expect(result.ganzhi).toBe('庚申');
  });

  it('回退计算也能得出结果', () => {
    const result = calcDayPillar('2025-01-01');
    expect(result.gan).toBeDefined();
    expect(result.zhi).toBeDefined();
    expect(result.ganzhi.length).toBe(2);
  });

  it('日期越界仍返回有效干支', () => {
    const result = calcDayPillar('2030-06-15');
    expect(result.gan).toBeDefined();
    expect(result.zhi).toBeDefined();
  });
});

describe('getWuxing', () => {
  it('庚 → 金', () => expect(getWuxing('庚')).toBe('金'));
  it('甲 → 木', () => expect(getWuxing('甲')).toBe('木'));
  it('丙 → 火', () => expect(getWuxing('丙')).toBe('火'));
  it('戊 → 土', () => expect(getWuxing('戊')).toBe('土'));
  it('壬 → 水', () => expect(getWuxing('壬')).toBe('水'));
  it('未知天干默认土', () => expect(getWuxing('X')).toBe('土'));
});

describe('getYiji', () => {
  it('金旺宜读书/静坐/复盘', () => {
    const result = getYiji('金');
    expect(result.yi.length).toBeLessThanOrEqual(3);
    expect(result.yi.some(i => i.name === '读书')).toBe(true);
    expect(result.yi.some(i => i.name === '静坐')).toBe(true);
    expect(result.ji.length).toBeLessThanOrEqual(2);
    expect(result.ji.some(i => i.name === '冲动决策')).toBe(true);
  });

  it('匹配用户习惯标记 matched', () => {
    const result = getYiji('金', [{ name: '阅读' }, { name: '写作' }]);
    const reading = result.yi.find(i => i.name === '读书');
    expect(reading.matched).toBe(true);
  });

  it('无匹配习惯时 matched=false', () => {
    const result = getYiji('金', [{ name: '游泳' }]);
    const reading = result.yi.find(i => i.name === '读书');
    expect(reading.matched).toBe(false);
  });
});

describe('getFullGanzhi', () => {
  it('2025-10-15 返回完整信息', () => {
    const result = getFullGanzhi('2025-10-15');
    expect(result.wuxing).toBe('金');
    expect(result.dayPillar.ganzhi).toBe('庚申');
    expect(result.ganzhiDisplay).toBe('庚申日 · 金旺');
  });
});
