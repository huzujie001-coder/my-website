# 蓉城律师所网站

前端部署于 GitHub Pages，真实 AI 咨询与法律条文检索由独立服务端提供。访问者无需登录。

- 本地开发：`npm ci`，然后 `npm run dev`。
- 更新部署：`npm run build`，将源代码与 docs 目录提交到 main；Pages 使用 main 分支的 /docs。
- 服务器地址在 vite.config.mjs 中，仅为公开接口地址，不包含密钥。
- 不要把模型 API 密钥放入 VITE_* 变量或前端代码。
- 微信与电话回访目前为演示，未实际发送律所。
- 法律信息和引用需由律师结合事实核实，知识库不包含全部中国法律。
