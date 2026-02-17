# 超级方块 - APK 构建说明

## 方案一：使用 EAS Build（推荐 - 云端构建）

### 优点
- 无需配置 Android SDK
- 在云端构建，速度快
- 可以直接下载 APK

### 步骤

#### 1. 注册/登录 Expo 账户
在命令行中运行：
```bash
cd src
npx eas login
```

按照提示输入：
- Email 地址
- 或 Expo 账户用户名

#### 2. 配置构建环境
```bash
npx eas build:configure
```

按照提示选择：
- Android 平台
- 构建配置（推荐使用默认）

#### 3. 构建开发版 APK
```bash
npm run build:android
```

或者：
```bash
eas build --platform android --profile preview
```

#### 4. 构建生产版 APK
```bash
npm run build:android:prod
```

或者：
```bash
eas build --platform android --profile production
```

#### 5. 下载 APK
构建完成后，控制台会显示下载链接，访问链接即可下载 APK 文件。

---

## 方案二：使用本地构建（需要 Android SDK）

### 优点
- 完全本地构建，无需网络
- 可以直接调试

### 前置条件
- 安装 Java Development Kit (JDK) 8 或更高
- 安装 Android SDK (API Level 31 或更高)
- 配置环境变量 ANDROID_HOME

### 步骤

#### 1. 配置 Android SDK
```bash
# 设置 ANDROID_HOME 环境变量
setx ANDROID_HOME "C:\Android\Sdk"

# 将 Android SDK 的 platform-tools 添加到 PATH
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
```

#### 2. 构建预览版 APK
```bash
cd src
eas build --platform android --profile preview --local
```

#### 3. 构建生产版 APK
```bash
cd src
eas build --platform android --profile production --local
```

构建的 APK 文件位于：
```
src/dist/*.apk
```

---

## 方案三：使用 Expo Go（快速测试）

### 步骤

#### 1. 启动开发服务器
```bash
cd src
npx expo start
```

#### 2. 使用 Expo Go 扫描二维码
- 在手机上安装 Expo Go 应用
- 扫描命令行中显示的二维码
- 即可预览和测试

---

## 推荐流程

### 快速测试阶段
使用方案三（Expo Go）进行快速测试和调试。

### 最终发布阶段
使用方案一（EAS Build 云端构建）生成正式的 APK 文件。

---

## 注意事项

1. **应用信息**
   - 应用名称：超级方块
   - 包名：com.superblock.game
   - 版本：1.0.0

2. **构建配置**
   - 开发版：使用 preview profile
   - 生产版：使用 production profile

3. **首次构建时间**
   - 首次构建可能需要 5-10 分钟
   - 后续构建会更快（使用缓存）

4. **APK 位置**
   - 云端构建完成后可在网页端下载
   - 本地构建在 `src/dist/` 目录

5. **测试设备要求**
   - Android 5.0 (API Level 21) 或更高
   - 支持新架构

---

## 故障排除

### 问题：无法登录 EAS
**解决方案**：
- 确保网络连接正常
- 检查 Expo 账户邮箱和密码
- 尝试使用 `eas login --non-interactive` 参数

### 问题：构建失败
**解决方案**：
- 检查 package.json 中的配置
- 确保 node_modules 已正确安装
- 运行 `npx expo doctor` 检查环境

### 问题：APK 无法安装
**解决方案**：
- 确保手机允许安装未知来源应用
- 检查 Android 版本兼容性
- 重新下载 APK 文件

---

## 联系方式

如有问题，可以访问：
- Expo 官网：https://expo.dev
- Expo 文档：https://docs.expo.dev
- EAS 文档：https://docs.expo.dev/build/introduction
