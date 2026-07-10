# 杨俊逸 · Living Index

一个零构建、可直接部署到 GitHub Pages 的个人品牌主页。内容包括关于、教育、工作、成果、旅行地图、阅读侧写、此刻与联系方式。

## 本地预览

```powershell
cd E:\Agent\Codex\context\personal-site
python -m http.server 8000 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:8000/
```

保存 `index.html`、`styles.css` 或 `script.js` 后刷新浏览器即可查看变化。

## 内容维护

- 页面文案与板块：编辑 `index.html`。
- 配色、排版与响应式布局：编辑 `styles.css`。
- 导航、微信复制与滚动索引：编辑 `script.js`。
- 旅行地点：编辑 `#travel` 中的 SVG 节点和 `.city-index`。
- 精选书目：编辑 `#reading` 中的 `.book`，并将封面保存到 `assets/books/`。
- 机构标识：保存到 `assets/logos/`，不要使用远程图片热链。
- 当前状态：编辑 `#now` 并同步更新月份。

## 自动检查

```powershell
node tests/site-audit.mjs
```

检查内容包括：

- 必需板块与公开联系方式；
- 28 个旅行地图节点；
- 本地图片资源完整性；
- 统一色彩变量与响应式规则；
- 键盘焦点和减少动画支持；
- 导航、复制与滚动索引脚本；
- 页面描述、Open Graph 和 favicon。

## 发布

仓库推送到 GitHub 后，在 `Settings → Pages` 中选择从目标分支的 `/root` 目录部署。正式地址确定后，再补充 canonical、`og:url` 和分享预览图。
