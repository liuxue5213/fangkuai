# 超级方块 - React Native 版

一个基于 React Native 和 Expo 开发的超级方块游戏。

## 游戏规则

| 规则项 | 具体说明 |
|-------|---------|
| 棋盘大小 | 9×9 |
| 方块颜色 | 7种 |
| 移动规则 | 沿空格路径移动，无步数限制 |
| 消除条件 | ≥5个同色方块相连 |
| 相连方向 | 8个方向（垂直、水平、斜向） |
| 初始方块 | 随机生成 5 个 |
| 新方块生成 | 每次移动后无消除时生成 2-3 个 |
| 生成位置 | 棋盘随机空位 |
| 分数计算 | 方块数量 × 10 分 |
| 连续操作 | 有消除可继续，无消除生成新方块 |
| 游戏结束 | 无足够空位放置新方块 |
| 游戏模式 | 单人分数模式 |

## 项目结构

```
src/
├── src/
│   ├── components/      # UI 组件
│   │   ├── GameBoard.tsx        # 棋盘组件
│   │   ├── Block.tsx            # 方块组件
│   │   ├── ScoreBoard.tsx       # 分数显示
│   │   ├── Controls.tsx          # 游戏控制
│   │   └── GameOverDialog.tsx   # 游戏结束对话框
│   ├── game/           # 游戏逻辑
│   │   ├── PathFinder.ts        # 路径计算 (BFS)
│   │   ├── BlockMatcher.ts      # 消除检测 (8方向)
│   │   ├── ScoreCalculator.ts   # 分数计算
│   │   └── BoardState.ts        # 棋盘状态管理
│   ├── types/          # 类型定义
│   │   ├── Block.ts             # 方块类型
│   │   ├── Board.ts             # 棋盘类型
│   │   └── GameState.ts         # 游戏状态类型
│   ├── utils/          # 工具函数
│   │   └── BlockColor.ts       # 颜色定义
│   ├── screens/        # 屏幕组件
│   │   └── GameScreen.tsx       # 游戏主屏幕
│   └── styles/         # 样式
│       └── Theme.ts             # 主题样式
└── App.tsx            # 应用入口
```

## 运行项目

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

### 3. 运行应用

- **Android**: 按 `a` 键或运行 `npm run android`
- **iOS**: 按 `i` 键或运行 `npm run ios`（需要 macOS）
- **Web**: 按 `w` 键或运行 `npm run web`

## 开发说明

### Node.js 警告

当前 Node.js 版本是 20.12.0，但 React Native 0.81.5 需要 >= 20.19.4。
虽然有警告，但项目仍然可以正常运行。建议升级 Node.js 版本以消除警告。

```bash
# 升级 Node.js 到最新版本
nvm install 20
nvm use 20
```

### TypeScript

项目使用 TypeScript 开发，包含完整的类型定义。

## 核心算法

### 路径计算 (BFS)
- 使用广度优先搜索算法计算方块移动路径
- 路径必须经过连续的空位

### 消除检测 (8方向)
- 检测 ≥5 个同色方块相连
- 支持垂直、水平、斜向 8 个方向

## 游戏策略

1. **局部 vs 全局**：不要过度专注于某个局部区域
2. **放弃的艺术**：当某个区域被"针对"时，果断放弃
3. **路径规划**：移动前规划路径，避免封死其他路径
4. **连击策略**：利用"有消除可继续操作"的规则刷高分

## 开发状态

✅ 项目基础框架
✅ 游戏核心逻辑
✅ UI 组件
✅ 游戏主屏幕

🚀 可以开始运行和测试！
