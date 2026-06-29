# Proposal: 补充项目级技术规范

> **Change:** `project-spec-supplement`  
> **状态:** 草稿  
> **Phase:** Phase 0（前置于所有实现阶段）

---

## 1. 问题

现有 8 个 capability spec 详细定义了各模块的行为、数据和交互。但整个项目缺少**统一的工程规范层**：

| 缺失项 | 影响 |
|--------|------|
| 无 Commands（构建/测试/运行命令） | 开发时不知道用什么命令启动和测试 |
| 无 Project Structure（目录结构） | 代码文件放哪缺乏约定，容易混乱 |
| 无 Code Style（代码风格规范） | 多人协作时风格不统一 |
| 无 Testing Strategy（测试策略） | 不知道测什么、怎么测、测多少 |
| 无 Boundaries（边界面板） | 不知道哪些能做、哪些要问、哪些绝不能做 |

## 2. 方案

创建一个项目级**根设计文档**（`design.md`），补充这 6 个缺失的工程规范层。它与现有的 capability spec 是**正交关系**：

```
项目根设计 (openspec/design.md)
    ↓ 被引用
capability specs (openspec/specs/*.md)
    ↓ 实现时遵循
代码
```

## 3. 范围

| 包含 | 不包含 |
|------|--------|
| 微信小程序的开发命令 | 各页面/组件的具体实现 |
| 完整目录结构 | 业务逻辑的改动 |
| 代码风格示例 | 第三方库的选择（已有约定） |
| 测试框架和策略 | 设计 tokens 的改动 |
| 三阶边界规则 | 现有 spec 内容的修改 |

## 4. 交付物

1. `openspec/design.md` — 项目根设计文档
2. 更新现有 capability spec 的 frontmatter，新增 `见根设计` 引用
