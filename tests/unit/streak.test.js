/* tests/unit/streak.test.js */
/* 验证: openspec/specs/habit-tracking.md §4, design.md §5.3 */

const {
  calcStreak,
  getStreakTitle,
  calcStreakReward,
  calcLongestStreak,
  isActiveDay,
  STREAK_TITLES,
  STREAK_EXP_REWARDS,
} = require('../../utils/streak');

describe('calcStreak', () => {
  it('无记录时返回 0', () => {
    expect(calcStreak([], '2025-10-15', { type: 'daily' })).toBe(0);
  });

  it('连续 7 天打卡返回 7', () => {
    const records = [
      { date: '2025-10-09', count: 1 },
      { date: '2025-10-10', count: 1 },
      { date: '2025-10-11', count: 1 },
      { date: '2025-10-12', count: 1 },
      { date: '2025-10-13', count: 1 },
      { date: '2025-10-14', count: 1 },
      { date: '2025-10-15', count: 1 },
    ];
    expect(calcStreak(records, '2025-10-15', { type: 'daily' })).toBe(7);
  });

  it('断点后重置为 1', () => {
    const records = [
      { date: '2025-10-13', count: 1 },
      // 10/14 未打卡 — 断点
      { date: '2025-10-15', count: 1 },
    ];
    expect(calcStreak(records, '2025-10-15', { type: 'daily' })).toBe(1);
  });

  it('今天未打卡返回 0（即使昨天有打卡）', () => {
    const records = [
      { date: '2025-10-14', count: 1 },
    ];
    expect(calcStreak(records, '2025-10-15', { type: 'daily' })).toBe(0);
  });

  it('工作日频率：周末不中断连续', () => {
    // 周五 10/10 打卡, 周六 10/11 非活跃日, 周日 10/12 非活跃日, 周一 10/13 打卡
    const records = [
      { date: '2025-10-10', count: 1 },
      { date: '2025-10-13', count: 1 },
    ];
    expect(calcStreak(records, '2025-10-13', { type: 'weekday' })).toBe(2);
  });

  it('自定义频率只检查指定星期', () => {
    // 仅周一(1)和周三(3)活跃: 周一打卡, 周二非活跃, 周三打卡
    const records = [
      { date: '2025-10-13', count: 1 }, // 周一
      { date: '2025-10-15', count: 1 }, // 周三
    ];
    expect(calcStreak(records, '2025-10-15', { type: 'custom', days: [1, 3] })).toBe(2);
  });

  it('count=0 视为未打卡', () => {
    const records = [
      { date: '2025-10-14', count: 0 },
      { date: '2025-10-15', count: 1 },
    ];
    expect(calcStreak(records, '2025-10-15', { type: 'daily' })).toBe(1);
  });
});

describe('getStreakTitle', () => {
  it('7 天 → 一周有成', () => {
    expect(getStreakTitle(7)).toBe('一周有成');
  });

  it('21 天 → 三周之功', () => {
    expect(getStreakTitle(21)).toBe('三周之功');
  });

  it('100 天 → 百日筑基', () => {
    expect(getStreakTitle(100)).toBe('百日筑基');
  });

  it('365 天 → 周而复始', () => {
    expect(getStreakTitle(365)).toBe('周而复始');
  });

  it('6 天 → null（未达任何称号）', () => {
    expect(getStreakTitle(6)).toBeNull();
  });

  it('50 天应返回 30 天称号（向下匹配）', () => {
    expect(getStreakTitle(50)).toBe('一月之期');
  });
});

describe('STREAK_TITLES', () => {
  it('7 天称号为"一周有成"', () => {
    expect(STREAK_TITLES[7]).toBe('一周有成');
  });

  it('21 天称号为"三周之功"', () => {
    expect(STREAK_TITLES[21]).toBe('三周之功');
  });

  it('包含 5 个里程碑', () => {
    expect(Object.keys(STREAK_TITLES)).toHaveLength(5);
  });
});

describe('calcStreakReward', () => {
  it('达到 7 天未领取 → 奖励 50', () => {
    expect(calcStreakReward(7, [])).toBe(50);
  });

  it('达到 21 天未领取 → 奖励 250 (50+200)', () => {
    expect(calcStreakReward(21, [])).toBe(250);
  });

  it('已领取 7 天奖励 → 只给 200', () => {
    expect(calcStreakReward(21, [7])).toBe(200);
  });

  it('全部已领取 → 0', () => {
    expect(calcStreakReward(100, [7, 21, 100])).toBe(0);
  });

  it('未达任何里程碑 → 0', () => {
    expect(calcStreakReward(3, [])).toBe(0);
  });
});

describe('calcLongestStreak', () => {
  it('无记录返回 0', () => {
    expect(calcLongestStreak([], { type: 'daily' })).toBe(0);
  });

  it('历史最长连续', () => {
    const records = [
      { date: '2025-10-01', count: 1 },
      { date: '2025-10-02', count: 1 },
      { date: '2025-10-03', count: 1 },
      // 断点
      { date: '2025-10-05', count: 1 },
      { date: '2025-10-06', count: 1 },
    ];
    expect(calcLongestStreak(records, { type: 'daily' })).toBe(3);
  });
});

describe('isActiveDay', () => {
  it('daily 始终活跃', () => {
    const d = new Date(2025, 9, 15); // 周三
    expect(isActiveDay(d, { type: 'daily' })).toBe(true);
  });

  it('weekday: 周一活跃', () => {
    const d = new Date(2025, 9, 13); // 周一
    expect(isActiveDay(d, { type: 'weekday' })).toBe(true);
  });

  it('weekday: 周六不活跃', () => {
    const d = new Date(2025, 9, 18); // 周六
    expect(isActiveDay(d, { type: 'weekday' })).toBe(false);
  });

  it('custom: 指定周一活跃', () => {
    const d = new Date(2025, 9, 13); // 周一(1)
    expect(isActiveDay(d, { type: 'custom', days: [1, 3, 5] })).toBe(true);
  });

  it('custom: 指定周二不活跃', () => {
    const d = new Date(2025, 9, 14); // 周二(2)
    expect(isActiveDay(d, { type: 'custom', days: [1, 3, 5] })).toBe(false);
  });
});

describe('STREAK_EXP_REWARDS', () => {
  it('7天奖励 50exp', () => {
    expect(STREAK_EXP_REWARDS[7]).toBe(50);
  });

  it('21天奖励 200exp', () => {
    expect(STREAK_EXP_REWARDS[21]).toBe(200);
  });

  it('100天奖励 1000exp', () => {
    expect(STREAK_EXP_REWARDS[100]).toBe(1000);
  });
});
