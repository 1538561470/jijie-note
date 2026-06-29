# Tasks: 补充项目级技术规范

> **Change:** `project-spec-supplement`  
> **依赖:** `design.md` 已审核通过  

---

## Task 1: 创建 app.wxss 全局样式（含 CSS 变量）

- **接受标准：** `app.wxss` 包含 [design-tokens spec](../specs/design-tokens.md) 中定义的全部 CSS 变量
- **涉及文件：** `app.wxss`
- **验证：** 在页面中引用变量如 `var(--paper-white)` 生效
- **估算：** 30 分钟

## Task 2: 建立目录骨架

- **接受标准：** 项目目录结构与 [design.md](./design.md) §3 一致
- **涉及文件：** `pages/`, `components/`, `utils/`, `services/`, `assets/data/`, `tests/unit/`, `tests/mocks/`
- **验证：** `ls -la` 检查目录是否存在
- **估算：** 20 分钟

## Task 3: 实现工具函数 — 天干地支查表

- **接受标准：** `utils/ganzhi.js` 根据公历日期返回干支
- **涉及文件：** `utils/ganzhi.js`, `assets/data/daily-ganzhi.json`
- **验证：** `npx jest tests/unit/ganzhi.test.js` 通过
- **估算：** 1 小时

## Task 4: 实现工具函数 — 农历转换

- **接受标准：** `utils/lunar.js` 根据公历日期返回农历日期
- **涉及文件：** `utils/lunar.js`, `assets/data/lunar-data.json`
- **验证：** `npx jest tests/unit/lunar.test.js` 通过
- **估算：** 1 小时

## Task 5: 实现工具函数 — 连续天数计算

- **接受标准：** `utils/streak.js` 正确计算打卡连续天数
- **涉及文件：** `utils/streak.js`
- **验证：** `npx jest tests/unit/streak.test.js` 通过
- **估算：** 45 分钟

## Task 6: 建立云开发基础设施

- **接受标准：** 云开发环境已开通，数据库集合已创建
- **涉及文件：** `cloud/functions/login/`, `cloud/database/schema/`
- **验证：** 云函数部署成功，数据库可读写
- **估算：** 30 分钟

## Task 7: 实现数据服务层接口

- **接受标准：** `services/task.js`, `services/habit.js`, `services/record.js`, `services/user.js` 定义了完整的 CRUD 接口
- **涉及文件：** `services/*.js`
- **验证：** 各 API 函数的参数和返回值类型明确
- **估算：** 1.5 小时

## Task 8: 实现公共组件骨架

- **接受标准：** `components/task-card/`, `components/habit-card/`, `components/stats-card/`, `components/yiji-card/`, `components/koi-display/`, `components/add-plan-drawer/`, `components/toast/` 各组件文件创建完毕
- **涉及文件：** `components/*/index.wxml`, `components/*/index.wxss`, `components/*/index.js`, `components/*/index.json`
- **验证：** 页面可引用组件且不报错
- **估算：** 1 小时

## Task 9: 更新 capability spec 引用

- **接受标准：** 所有 8 个 capability spec 的 frontmatter 增加 `见根设计` 引用
- **涉及文件：** `openspec/specs/*.md`
- **验证：** 每份 spec 在依赖声明后新增一行 `> **根设计:** [design.md](../design.md)`
- **估算：** 15 分钟
