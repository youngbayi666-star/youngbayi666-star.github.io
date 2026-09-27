# 艺术地图：去过的地方，成为了我的一部分

## 用户选择

用户要求推翻卡片与标签切换方案，并明确选择“艺术地图：留白、巨幅地球、精致排版”。旅行区据此完全重做。

## 视觉与交互

- 暖纸色背景，巨幅无外框地球直接融入页面；蓝色标题、细线和坐标注记呼应整站。
- 世界、国内城市、印度尼西亚始终位于同一个地球场景。选择坐标时真实移动相机，取消原来的双地图、视图标签、下拉选择和深色容器。
- 右侧展示当前坐标，底部为五个快捷地点与完整 28 项索引。索引号码是列表位置，不表示实际旅行顺序。
- 随机抵达、上一坐标、下一坐标与回到世界均支持键盘。鼠标可直接选取地球上的点；地点列表提供等价的非地图操作。
- 不新增未经用户提供的旅行地点、路线顺序或旅途故事。保留 27 个国内地点及印度尼西亚。
- 默认不自动旋转，减少动画设置下镜头立即到位；屏幕之外暂停渲染。
- 数据加载失败后保留地名选择与经纬度浏览。

## 技术与来源

ui-ux-pro-max 用于空间交互和响应式原则。3D 产品预览检索仅取直接旋转与热点操作建议，没有照搬电商或拟物风格。

Globe.gl 官方 API：https://globe.gl/ （pointOfView、pointsData、HTML markers、pauseAnimation）。

世界边界本地化为 `assets/maps/world-countries.geojson`，来源于原有 Globe.gl 2.46.1 示例数据：https://cdn.jsdelivr.net/npm/globe.gl@2.46.1/example/datasets/ne_110m_admin_0_countries.geojson 。不再依赖 D3，旧中国 GeoJSON 文件保留。

## 验证

`node tests/site-audit.mjs`、`node --check script.js`。

`tests/travel-design-check.cjs`：1440、768、390、320 px 无横向溢出；一个画布；28 地点；实际相机经纬度；前后选择；随机不重复；Escape 重置；地图数据失败后的可用性。`BROWSER_CHANNEL=msedge` 可指定本地 Edge。

截图输出到被 Git 忽略的 `artifacts/travel-art-*.png`。
