# 杨俊逸 · Living Index

一个零构建、可直接部署到 GitHub Pages 的个人品牌主页。内容包括关于、教育、工作、旅行地图、阅读侧写、此刻与联系方式。

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
node --check script.js
```

检查内容包括：

- 必需板块与公开联系方式；
- 28 个旅行地图节点；
- 本地图片资源完整性；
- 统一色彩变量与响应式规则；
- 键盘焦点和减少动画支持；
- 导航、复制与滚动索引脚本；
- 页面描述、Open Graph 和 favicon。

## 图片优化

头像与机构 Logo 的 WebP 文件由源 PNG 可重复生成：

```powershell
python scripts/optimize-assets.py
node tests/site-audit.mjs
```

脚本会生成 480、800、1200 三档头像和适合实际显示尺寸的 Logo。页面通过 `srcset` 选择头像资源；不要直接把源 PNG 重新写回 HTML。

## 视觉验收

`tests/section-audit.html` 是同源逐板块截图工具。启动本地服务后可以直接检查，例如：

```text
http://127.0.0.1:8000/tests/section-audit.html?section=education&offset=250
http://127.0.0.1:8000/tests/section-audit.html?section=reading&offset=500&width=390
```

固定验收视口为 `1440×900`、`1024×768`、`768×1024` 和 `390×844`。检查页面级横向溢出、标题裁切、图片越界、Logo 对比度、卡片覆盖与异常留白。

## 发布

仓库推送到 GitHub 后，在 `Settings → Pages` 中选择从目标分支的 `/root` 目录部署。正式地址确定后，再补充 canonical、`og:url` 和分享预览图。
