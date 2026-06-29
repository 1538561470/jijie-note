/* tests/unit/lunar.test.js */
/* 验证: openspec/specs/lunar-calendar.md §2 */

const { getLunarDate, LUNAR_MONTH_NAMES, LUNAR_DAY_NAMES } = require('../../utils/lunar');

describe('getLunarDate', () => {
  it('返回基本结构', () => {
    const result = getLunarDate('2025-10-15');
    expect(result).toHaveProperty('lunarYear');
    expect(result).toHaveProperty('lunarMonth');
    expect(result).toHaveProperty('lunarDay');
  });

  it('返回干支信息', () => {
    const result = getLunarDate('2025-10-15');
    expect(result).toHaveProperty('ganzhi');
    expect(result).toHaveProperty('wuxing');
    expect(result.ganzhi).toBeTruthy();
    expect(result.wuxing).toBeTruthy();
  });

  it('跨年日期正常', () => {
    const result = getLunarDate('2025-12-31');
    expect(result.lunarYear).toBeTruthy();
    expect(result.lunarMonth).toBeTruthy();
  });

  it('年初日期正常', () => {
    const result = getLunarDate('2025-01-01');
    expect(result.lunarYear).toBeTruthy();
    expect(result.lunarMonth).toBeTruthy();
  });
});

describe('LUNAR_MONTH_NAMES', () => {
  it('包含完整的12个月', () => {
    expect(LUNAR_MONTH_NAMES).toHaveLength(13); // index 0 为空
    expect(LUNAR_MONTH_NAMES[1]).toBe('正月');
    expect(LUNAR_MONTH_NAMES[12]).toBe('腊月');
    expect(LUNAR_MONTH_NAMES[7]).toBe('七月');
  });
});

describe('LUNAR_DAY_NAMES', () => {
  it('包含完整的30天', () => {
    expect(LUNAR_DAY_NAMES).toHaveLength(31); // index 0 为空
    expect(LUNAR_DAY_NAMES[1]).toBe('初一');
    expect(LUNAR_DAY_NAMES[15]).toBe('十五');
    expect(LUNAR_DAY_NAMES[30]).toBe('三十');
  });
});
