# Ubuntu Neovim Python 开发环境

> 最后更新时间：2026-07

目标：

- Python 开发
- FastAPI
- LSP
- 自动补全
- 文件搜索
- 全文搜索
- 最少插件
- 长期维护

---

# 1. 安装 Neovim

建议：

```
Neovim >= 0.11
```

查看版本：

```bash
nvim --version
```

---

# 2. 安装 lazy.nvim

```bash
git clone https://github.com/folke/lazy.nvim \
~/.local/share/nvim/lazy/lazy.nvim
```

---

# 3. 配置目录

```
~/.config/nvim/
    init.lua
```

---

# 4. 最终插件

仅安装下面几个插件。

| 插件 | 用途 |
|------|------|
| lazy.nvim | 插件管理 |
| tokyonight.nvim | 主题 |
| nvim-tree | 目录树 |
| telescope.nvim | 文件搜索 |
| nvim-web-devicons | 图标 |
| nvim-lspconfig | LSP |
| blink.cmp | 自动补全 |
| nvim-treesitter | 语法高亮 |
| nvim-autopairs | 自动括号 |

原则：

> 能不用插件就不用插件。

---

# 5. 安装插件

打开 Neovim：

```vim
:Lazy sync
```

更新：

```vim
:Lazy update
```

---

# 6. Treesitter

安装语言：

```lua
ensure_installed = {
    "python",
    "lua",
    "bash",
    "json",
    "yaml",
    "toml",
    "markdown",
}
```

更新：

```vim
:TSUpdate
```

---

# 7. Python LSP

安装：

```bash
python3 -m pip install basedpyright
```

验证：

```bash
basedpyright --version
```

Neovim：

```lua
vim.lsp.enable("basedpyright")
```

---

# 8. Python 虚拟环境

创建：

```bash
python3 -m venv .venv
```

激活：

```bash
source .venv/bin/activate
```

打开项目：

```bash
nvim .
```

查看解释器：

```vim
:!which python
```

应该显示：

```
project/.venv/bin/python
```

---

# 9. Blink

推荐：

```lua
keymap = {
    preset = "super-tab",
}
```

Tab：

- 选择补全
- 接受补全

---

# 10. AutoPairs

插件：

```
windwp/nvim-autopairs
```

配置：

```lua
{
    "windwp/nvim-autopairs",
    event = "InsertEnter",
    opts = {},
}
```

安装：

```vim
:Lazy sync
```

---

# 11. Telescope

搜索文件：

```
Space ff
```

全文搜索：

```
Space fg
```

查看 Buffer：

```
Space fb
```

---

# 12. NvimTree

打开：

```
Ctrl+n
```

---

# 13. LSP

跳定义：

```
gd
```

返回：

```
Ctrl+o
```

前进：

```
Ctrl+i
```

查看引用：

```
gr
```

跳实现：

```
gi
```

查看文档：

```
K
```

重命名：

```
Space rn
```

---

# 14. Buffer

关闭当前：

```
:bd
```

或者：

```
Space bd
```

（建议绑定）

查看：

```
Space fb
```

---

# 15. 常用命令

插件：

```vim
:Lazy
```

LSP：

```vim
:LspInfo
```

Treesitter：

```vim
:TSInstallInfo
```

健康检查：

```vim
:checkhealth
```

---

# 16. tmux

创建：

```bash
tmux new -s work
```

退出：

```
Ctrl+b d
```

恢复：

```bash
tmux attach -t work
```

---

# 17. 推荐工作流

```
GNOME Terminal
        │
      tmux
        │
 ┌──────┴────────┐
 │               │
 Neovim      Codex CLI
 │               │
 └──────┬────────┘
        │
      Python
```

左：

- Neovim

右：

- Codex CLI

下面：

- pytest
- uvicorn
- docker logs

---

# 18. 当前插件数量

最终仅保留：

```
lazy.nvim
tokyonight
nvim-tree
telescope
treesitter
lspconfig
blink.cmp
autopairs
```

维护成本低。

升级简单。

---

# 19. 开发原则

不要折腾编辑器。

把时间投入：

- Python
- FastAPI
- WebSocket
- Redis
- PostgreSQL
- Docker
- pytest
- Git
- Codex CLI

编辑器只是工具。

生产力来自工程能力。

# 20. 文件内容
~/.config/nvim/init.lua
```sh
--------------------------------------------------
-- 基础设置
--------------------------------------------------
vim.g.mapleader = " "
vim.g.maplocalleader = " "

vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.termguicolors = true
vim.opt.signcolumn = "yes"

--------------------------------------------------
-- lazy.nvim
--------------------------------------------------
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"

if not vim.uv.fs_stat(lazypath) then
    error("lazy.nvim not found: " .. lazypath)
end

vim.opt.rtp:prepend(lazypath)

--------------------------------------------------
-- 插件
--------------------------------------------------
require("lazy").setup({

    --------------------------------------------------
    -- 图标
    --------------------------------------------------
    {
        "nvim-tree/nvim-web-devicons",
    },

    --------------------------------------------------
    -- 目录树
    --------------------------------------------------
    {
        "nvim-tree/nvim-tree.lua",
        dependencies = {
            "nvim-tree/nvim-web-devicons",
        },
        opts = {},
    },

    --------------------------------------------------
    -- 当前文件类、函数结构树
    --------------------------------------------------
    {
        "stevearc/aerial.nvim",

        dependencies = {
            "nvim-treesitter/nvim-treesitter",
            "nvim-tree/nvim-web-devicons",
        },

        opts = {
            -- 优先通过 Tree-sitter 获取结构，失败时使用 LSP
            backends = {
                "treesitter",
                "markdown",
                "lsp"
            },

            layout = {
                -- 固定显示在右侧
                default_direction = "right",

                -- 宽度范围
                min_width = 30,
                max_width = 45,

                -- 尽量放在编辑器边缘
                placement = "edge",
            },

            -- 显示树形引导线
            show_guides = true,

            -- 显示图标
            icons = {},

            -- 自动附加到支持的文件
            attach_mode = "window",

            -- Aerial 窗口关闭后不退出 Neovim
            close_automatic_events = {},

            -- 结构树中显示这些符号
            filter_kind = {
                "Class",
                "Constructor",
                "Enum",
                "Function",
                "Interface",
                "Method",
                "Module",
                "Namespace",
                "Property",
                "Struct",
                "Trait",
            },

            -- 在结构树中按回车跳转后，焦点返回代码窗口
            post_jump_cmd = "normal! zz",
        },

        keys = {
            {
                "<leader>a",
                "<cmd>AerialToggle! right<CR>",
                desc = "打开或关闭代码结构树",
            },
            {
                "<leader>ao",
                "<cmd>AerialOpen right<CR>",
                desc = "打开代码结构树",
            },
            {
                "<leader>ac",
                "<cmd>AerialClose<CR>",
                desc = "关闭代码结构树",
            },
            {
                "[s",
                "<cmd>AerialPrev<CR>",
                desc = "上一个代码结构",
            },
            {
                "]s",
                "<cmd>AerialNext<CR>",
                desc = "下一个代码结构",
            },
        },
    },

    --------------------------------------------------
    -- 文件搜索与全文搜索
    --------------------------------------------------
    {
        "nvim-telescope/telescope.nvim",
        dependencies = {
            "nvim-lua/plenary.nvim",
        },
    },

    --------------------------------------------------
    -- LSP
    --------------------------------------------------
    {
        "neovim/nvim-lspconfig",
    },
    --------------------------------------------------
    -- 自动补全
    --------------------------------------------------
    {
    "saghen/blink.cmp",
    version = "*",

    opts = {
        keymap = {
            preset = "default",

            ----------------------------------------------------------------
            -- 补全菜单
            ----------------------------------------------------------------

            -- 手动触发补全
            ["<C-Space>"] = { "show", "show_documentation", "hide_documentation" },

            ----------------------------------------------------------------
            -- 候选项选择
            ----------------------------------------------------------------

            -- 下一个
            ["<C-n>"] = { "select_next", "fallback" },

            -- 上一个
            ["<C-p>"] = { "select_prev", "fallback" },

            ----------------------------------------------------------------
            -- 文档滚动
            ----------------------------------------------------------------

            ["<C-d>"] = { "scroll_documentation_down", "fallback" },
            ["<C-u>"] = { "scroll_documentation_up", "fallback" },

            ----------------------------------------------------------------
            -- 确认补全
            ----------------------------------------------------------------

            ["<C-y>"] = { "accept", "fallback" },

            ----------------------------------------------------------------
            -- 关闭补全
            ----------------------------------------------------------------

            ["<C-e>"] = { "hide", "fallback" },

            ----------------------------------------------------------------
            -- Snippet
            ----------------------------------------------------------------

            ["<Tab>"] = { "snippet_forward", "fallback" },
            ["<S-Tab>"] = { "snippet_backward", "fallback" },
        },

        completion = {
            documentation = {
                auto_show = true,
                auto_show_delay_ms = 200,
            },
        },

        sources = {
            default = {
                "lsp",
                "path",
                "snippets",
                "buffer",
            },
        },
    },

    opts_extend = {
        "sources.default",
    },
    },
    --------------------------------------------------
    -- 自动括号
    --------------------------------------------------
    {
        "windwp/nvim-autopairs",
        event = "InsertEnter",
        opts = {},
    },
    --------------------------------------------------
    -- 语法高亮
    --------------------------------------------------
    {
        "nvim-treesitter/nvim-treesitter",

        branch = "main",

        build = ":TSUpdate",

        lazy = false,

        config = function()
            local treesitter = require("nvim-treesitter")

            treesitter.setup({})

            treesitter.install({
                "python",
                "lua",
                "bash",
                "json",
                "yaml",
                "toml",
                "markdown",
                "markdown_inline",
                "vim",
                "vimdoc",
                "query",
            })
        end,
    },
    --------------------------------------------------
    -- 主题
    --------------------------------------------------
    {
        "catppuccin/nvim",
        name = "catppuccin",
        lazy = false,
        priority = 1000,

        config = function()
            require("catppuccin").setup({
                flavour = "latte", -- latte, frappe, macchiato, mocha

                integrations = {
                    blink_cmp = true,
                    gitsigns = true,
                    telescope = true,
                    treesitter = true,
                    nvimtree = true,
                    aerial = true,
                },
            })

            vim.cmd.colorscheme("catppuccin")
        end,
    },
    --------------------------------------------------
    -- Git 状态栏
    --------------------------------------------------
    {
        "lewis6991/gitsigns.nvim",
        opts = {},
    },
    --------------------------------------------------
    -- 代码格式化
    --------------------------------------------------
    {
        "stevearc/conform.nvim",

        event = { "BufWritePre" },

        opts = {
            formatters_by_ft = {

                lua = { "stylua" },

                python = { "ruff_format" },

                sh = { "shfmt" },

                bash = { "shfmt" },

                json = { "prettier" },

                yaml = { "prettier" },

                markdown = { "prettier" },

                toml = { "taplo" },
            },

            format_on_save = {
                timeout_ms = 500,
                lsp_fallback = true,
            },
        },
    },
    --------------------------------------------------
    -- Trouble
    --------------------------------------------------
    {
        "folke/trouble.nvim",

        dependencies = {
            "nvim-tree/nvim-web-devicons",
        },

        opts = {},
    },
})

--------------------------------------------------
-- 自动折叠
--------------------------------------------------
vim.opt.foldmethod = "expr"
vim.opt.foldexpr = "v:lua.vim.treesitter.foldexpr()"

vim.opt.foldenable = true
vim.opt.foldlevel = 99
vim.opt.foldlevelstart = 99

--------------------------------------------------
-- Telescope 快捷键
--------------------------------------------------
local builtin = require("telescope.builtin")

vim.keymap.set(
    "n",
    "<leader>ff",
    builtin.find_files,
    { desc = "搜索文件" }
)

vim.keymap.set(
    "n",
    "<leader>fg",
    builtin.live_grep,
    { desc = "全文搜索" }
)

vim.keymap.set(
    "n",
    "<leader>fb",
    builtin.buffers,
    { desc = "搜索已打开文件" }
)

--------------------------------------------------
-- 目录树快捷键
--------------------------------------------------
vim.keymap.set(
    "n",
    "<C-n>",
    "<cmd>NvimTreeToggle<CR>",
    { desc = "打开或关闭目录树" }
)

--------------------------------------------------
-- Blink LSP 补全能力
--------------------------------------------------
local capabilities = require("blink.cmp").get_lsp_capabilities()

vim.lsp.config("*", {
    capabilities = capabilities,
})


--------------------------------------------------
-- Python LSP
--------------------------------------------------
vim.lsp.config("basedpyright", {
    settings = {
        basedpyright = {
            analysis = {
                typeCheckingMode = "standard",
                autoSearchPaths = true,
                useLibraryCodeForTypes = true,
            },
        },
    },
})

vim.lsp.enable("basedpyright")

--------------------------------------------------
-- LSP 快捷键
--------------------------------------------------
vim.api.nvim_create_autocmd("LspAttach", {
    callback = function(event)
        local opts = {
            buffer = event.buf,
            silent = true,
        }

        vim.keymap.set(
            "n",
            "gd",
            vim.lsp.buf.definition,
            vim.tbl_extend("force", opts, {
                desc = "跳转定义",
            })
        )

        vim.keymap.set(
            "n",
            "gr",
            vim.lsp.buf.references,
            vim.tbl_extend("force", opts, {
                desc = "查找引用",
            })
        )

        vim.keymap.set(
            "n",
            "gi",
            vim.lsp.buf.implementation,
            vim.tbl_extend("force", opts, {
                desc = "跳转实现",
            })
        )

        vim.keymap.set(
            "n",
            "K",
            vim.lsp.buf.hover,
            vim.tbl_extend("force", opts, {
                desc = "查看文档",
            })
        )

        vim.keymap.set(
            "n",
            "<leader>rn",
            vim.lsp.buf.rename,
            vim.tbl_extend("force", opts, {
                desc = "重命名",
            })
        )
    end,
})

--------------------------------------------------
-- gitsigns 快捷键
--------------------------------------------------
vim.keymap.set(
    "n",
    "]h",
    "<cmd>Gitsigns next_hunk<CR>",
    { desc = "下一个 Git 修改" }
)

vim.keymap.set(
    "n",
    "[h",
    "<cmd>Gitsigns prev_hunk<CR>",
    { desc = "上一个 Git 修改" }
)

--------------------------------------------------
-- Diagnostic Sign 配置图标
--------------------------------------------------

--------------------------------------------------
-- Diagnostic
--------------------------------------------------
vim.diagnostic.config({

    virtual_text = false,

    -- 左侧图标
    signs = {
        text = {
            [vim.diagnostic.severity.ERROR] = " ",
            [vim.diagnostic.severity.WARN]  = " ",
            [vim.diagnostic.severity.INFO]  = " ",
            [vim.diagnostic.severity.HINT]  = "󰌵 ",
        },
    },

    underline = true,

    severity_sort = true,

    update_in_insert = false,

    float = {
        border = "rounded",
        source = "always",
    },
})

--------------------------------------------------
-- Trouble 快捷键
--------------------------------------------------
vim.keymap.set(
    "n",
    "<leader>xx",
    "<cmd>Trouble diagnostics toggle<CR>",
    { desc = "Workspace Diagnostics" }
)

vim.keymap.set(
    "n",
    "<leader>xX",
    "<cmd>Trouble diagnostics toggle filter.buf=0<CR>",
    { desc = "Buffer Diagnostics" }
)

vim.keymap.set(
    "n",
    "<leader>cs",
    "<cmd>Trouble symbols toggle focus=false<CR>",
    { desc = "Document Symbols" }
)

vim.keymap.set(
    "n",
    "<leader>cl",
    "<cmd>Trouble lsp toggle focus=false win.position=right<CR>",
    { desc = "LSP Definitions / References" }
)

vim.keymap.set(
    "n",
    "<leader>xL",
    "<cmd>Trouble loclist toggle<CR>",
    { desc = "Location List" }
)

vim.keymap.set(
    "n",
    "<leader>xQ",
    "<cmd>Trouble qflist toggle<CR>",
    { desc = "Quickfix List" }
)

--------------------------------------------------
-- Ctrl + 方向键 快捷键
--------------------------------------------------
vim.keymap.set("n", "<C-h>", "<C-w>h", { desc = "Move Left Window" })
vim.keymap.set("n", "<C-j>", "<C-w>j", { desc = "Move Down Window" })
vim.keymap.set("n", "<C-k>", "<C-w>k", { desc = "Move Up Window" })
vim.keymap.set("n", "<C-l>", "<C-w>l", { desc = "Move Right Window" })
```