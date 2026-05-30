# Git Worktree 和 Codex 结合

## 手动 Git Worktree + Codex

1. 当前项目地址
```sh
~/Magic/Wlb/FastApi100
```

2. 创建新分支并生成独立的工作区

创建
```sh
git worktree add ../FastApi100-auth -b feature/auth
```
结果
```sh
(hugging) ➜  Wlb ll |grep Fast
drwxrwxr-x  8 zcj zcj 4.0K  5月 23 14:30 FastApi100
drwxrwxr-x  5 zcj zcj 4.0K  5月 30 13:24 FastApi100-auth
```
进入
```sh
cd ../FastApi100-auth
```
启动
```sh
codex
```

3. 多AGENT并行
启动
```sh
git worktree add ../FastApi100-ui -b feature/ui
git worktree add ../FastApi100-api -b feature/api
git worktree add ../FastApi100-test -b feature/test
```

进入
```sh
cd ../FastApi100-ui
codex
cd ../FastApi100-api
codex
cd ../FastApi100-test
codex
```

4. 查看所有 worktree
```sh
git worktree list

(hugging) ➜  FastApi100 git:(main) ✗ git worktree list
/home/zcj/Magic/Wlb/FastApi100       5df80d2 [main]
/home/zcj/Magic/Wlb/FastApi100-auth  5df80d2 [feature/auth]
```

5. 合并worktree
切回主分支
```sh
cd ../FastApi100
```
合并
```sh
git merge feature/auth
```


6. 删除worktree
退出
```sh
cd ~/projects/FastApi100
```
删除
```sh
git worktree remove ../myapp-auth
```
清理
```sh
git worktree prune
```


## Codex App GUI
1. Mac Windows 都有, Linux 等通知, 哈哈哈.
```sh
mac 确实是AI浪潮下的一等公民
```

## CLI 自动创建 worktree (实验功能)
1. 创建
```sh
codex --worktree auth
```


## 速查流程

```sh
# 查看所有 worktree
git worktree list

# 创建新 worktree + 新分支
git worktree add ../auth -b feature/auth

# 使用已有分支创建 worktree
git worktree add ../auth feature/auth

# 删除 worktree
git worktree remove ../auth

# 清理失效记录
git worktree prune

# 查看分支对应关系
git branch -vv

# 合并回主分支
git checkout main
git merge feature/auth
```