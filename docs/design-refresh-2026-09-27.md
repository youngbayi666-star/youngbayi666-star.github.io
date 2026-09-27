# 2026-09-27 个人主页视觉优化

## 方向

按用户要求使用 ui-ux-pro-max 检索设计系统，再根据“简约大气”的目标选用 Minimalism & Swiss Style。保留 Living Index、真实肖像和章节索引，以浅底、深色文字、单一蓝色强调和明确留白组织内容。

- 首屏：大标题、拱形肖像背景和四项状态。
- 实习经历：统一日期、Logo 和内容网格；手机采用纵向排列，标识按视觉大小校准。
- 教育与成果：轻边框、克制圆角和清晰信息层级。
- 旅行：深色章节保留交互地图；阅读采用两列手机书架。
- 联系区：按语义分行；导航具有键盘焦点及减少动画支持。

## 素材来源

- 京东科技 SVG：来自 [京东科技官网](https://www.jdt.com.cn/) 页头，原始地址为 https://img1.jcloudcs.com/jdt/header/jdt-logo.svg 。本地文件：`assets/logos/logo-jd-tech.svg`，未修改 SVG 路径。标识仅用于展示实习经历。
- Archivo 字体：Google Fonts，https://fonts.google.com/specimen/Archivo 。已保存 regular/bold 字体和 SIL Open Font License（`assets/fonts/OFL-Archivo.txt`）。中文使用设备可用的无衬线字体。

## 验证

- `node tests/site-audit.mjs`：页面结构、本地图片、元数据、响应式及无障碍基础检查。
- Edge 无头浏览器：1440、1024、768、390、320 px 宽度检查；手机菜单开关和 Escape；地球、中国 27 个地点、图片加载与页面错误检查。
- 截图保存在被 Git 忽略的 `artifacts/refresh-*.png`。

本次只修改本地站点，未执行部署。
