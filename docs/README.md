# VitePress 博客换电脑恢复指南

---

# 1. 安装基础环境

## Ubuntu

```bash
sudo apt update
sudo apt install -y git nodejs npm
```

建议：

- Node.js 20+
- Node.js 22 更推荐

---

# 2. 配置 Git 身份

```bash
git config --global user.name "DaveIW2034"
git config --global user.email "你的GitHub邮箱"
```

---

# 3. 配置 SSH Key

## 生成 SSH Key

```bash
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
```

---

## 查看公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出内容。

---

## 添加到 GitHub

打开：

```text
GitHub
→ Settings
→ SSH and GPG keys
→ New SSH key
```

粘贴公钥。

---

## 测试 SSH

```bash
ssh -T git@github.com
```

看到类似内容说明成功：

```text
Hi DaveIW2034! You've successfully authenticated...
```

---

# 4. 克隆博客仓库

```bash
git clone git@github.com:DaveIW2034/DaveIW2034.github.io.git
```

进入项目：

```bash
cd DaveIW2034.github.io
```

---

# 5. 安装项目依赖

```bash
npm install
```

---

# 6. 本地启动博客

```bash
npm run docs:build
npm run docs:preview
npm run docs:dev
```

浏览器访问：

```text
http://localhost:5173
```

---

# 7. 日常更新博客

## 拉取最新代码

```bash
git pull
```

---

## 写完文章后提交

```bash
git add .
git commit -m "add new post"
git push
```

---

# 8. 自动部署

推送后：

```text
GitHub Actions
```

会自动部署博客。

博客地址：

```text
https://daveiw2034.github.io/
```

---

# 9. 推荐 .gitignore

```gitignore
node_modules
dist

docs/.vitepress/dist
docs/.vitepress/cache

.DS_Store
*.log
```

---

# 10. 注意事项

不要提交：

```text
node_modules/
docs/.vitepress/dist/
docs/.vitepress/cache/
```

这些目录应该被 `.gitignore` 忽略。

# 11. giscus 配置
<script src="https://giscus.app/client.js"
        data-repo="DaveIW2034/DaveIW2034.github.io"
        data-repo-id="R_kgDOSeVGnQ"
        data-category="Announcements"
        data-category-id="DIC_kwDOSeVGnc4C9Hj-"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>

---