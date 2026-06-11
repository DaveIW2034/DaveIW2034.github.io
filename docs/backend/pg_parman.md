# Docker 部署 PostgreSQL 16 + pg_partman + pg_cron 实战

## 背景

在业务系统中，日志表、邮件发送记录、MQ 消费记录、审计记录等数据增长速度非常快。

例如：

```text
email_log
task_log
mq_log
audit_log
```

当数据达到千万级甚至亿级后，单表查询和维护成本会明显增加。

PostgreSQL 原生提供了 Partition（分区表）功能，而 pg_partman 可以帮助我们自动管理分区生命周期。

本文记录使用 Docker 部署：

```text
PostgreSQL 16
+
pg_partman
+
pg_cron
```

实现：

* 自动创建未来分区
* 自动删除历史分区
* 自动维护分区

---

# 什么是 pg_partman

pg_partman 是 PostgreSQL 生态中最成熟的分区管理扩展。

它可以自动完成：

```text
创建未来分区
删除过期分区
维护分区状态
```

例如按月分区：

```text
email_log
├── email_log_p2026_06
├── email_log_p2026_07
├── email_log_p2026_08
├── email_log_p2026_09
```

即使业务代码只执行：

```sql
INSERT INTO email_log ...
```

也无需关心具体写入哪个分区。

---

# 项目结构

```text
PostgreSQL/
├── docker-compose.yml
└── Dockerfile
```

---

# Dockerfile

基于 PostgreSQL 16 安装：

```dockerfile
FROM postgres:16

RUN apt-get update && \
    apt-get install -y \
        postgresql-16-partman \
        postgresql-16-cron && \
    rm -rf /var/lib/apt/lists/*
```

---

# docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    build: .

    container_name: postgres_db

    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: database

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

    command:
      - postgres
      - -c
      - shared_preload_libraries=pg_cron
      - -c
      - cron.database_name=database

volumes:
  postgres_data:
```

---

# 启动服务

构建并启动：

```bash
docker compose up -d --build
```

查看容器：

```bash
docker ps
```

进入容器：

```bash
docker exec -it postgres_db bash
```

连接数据库：

```bash
psql -U root -d database
```

---

# 安装扩展

创建 schema：

```sql
CREATE SCHEMA partman;
```

安装 pg_partman：

```sql
CREATE EXTENSION pg_partman SCHEMA partman;
```

安装 pg_cron：

```sql
CREATE EXTENSION pg_cron;
```

查看已安装扩展：

```sql
SELECT extname
FROM pg_extension;
```

正常结果：

```text
plpgsql
pg_cron
pg_partman
```

---

# 创建分区父表

创建邮件日志表：

```sql
CREATE TABLE email_log (
    id BIGSERIAL,
    content TEXT,
    created_at TIMESTAMP NOT NULL
)
PARTITION BY RANGE (created_at);
```

---

# 注册到 pg_partman

将表交给 pg_partman 管理：

```sql
SELECT partman.create_parent(
    p_parent_table := 'public.email_log',
    p_control := 'created_at',
    p_interval := '1 month',
    p_type := 'range'
);
```

参数说明：

```text
p_parent_table  分区父表
p_control       分区字段
p_interval      分区间隔
p_type          分区类型
```

本例表示：

```text
按 created_at
按月分区
使用 PostgreSQL 原生 Range Partition
```

---

# 配置预创建分区

设置提前创建未来 3 个分区：

```sql
UPDATE partman.part_config
SET premake = 3
WHERE parent_table = 'public.email_log';
```

例如当前时间：

```text
2026-06
```

则会自动存在：

```text
2026-06
2026-07
2026-08
2026-09
```

---

# 手动执行维护

首次测试可以手动执行：

```sql
SELECT partman.run_maintenance();
```

该命令负责：

```text
创建未来分区
删除过期分区
同步配置
```

---

# 查看分区

查看当前分区结构：

```sql
SELECT *
FROM pg_partition_tree('email_log');
```

示例结果：

```text
email_log

├── email_log_p2026_06
├── email_log_p2026_07
├── email_log_p2026_08
├── email_log_p2026_09
```

---

# 测试数据插入

插入数据：

```sql
INSERT INTO email_log (
    content,
    created_at
)
VALUES (
    'test message',
    now()
);
```

查询：

```sql
SELECT *
FROM email_log;
```

PostgreSQL 会自动路由到对应月份分区。

业务层无需关心具体分区表名称。

---

# 配置历史数据保留

仅保留最近 12 个月：

```sql
UPDATE partman.part_config
SET retention = '12 months'
WHERE parent_table = 'public.email_log';
```

允许自动删除：

```sql
UPDATE partman.part_config
SET retention_keep_table = false
WHERE parent_table = 'public.email_log';
```

效果：

```text
2025-06
2025-07
...
2026-06
```

当进入：

```text
2026-07
```

时：

```text
2025-06
```

对应分区将自动删除。

---

# 配置自动维护任务

利用 pg_cron 定时执行维护。

创建任务：

```sql
SELECT cron.schedule(
    'partman-maintenance',
    '*/5 * * * *',
    $$SELECT partman.run_maintenance();$$
);
```

表示：

```text
每 5 分钟
执行一次分区维护
```

查看任务：

```sql
SELECT *
FROM cron.job;
```

---

# 生产环境推荐配置

对于日志类业务：

```text
email_log
task_log
mq_log
audit_log
```

推荐：

```text
PostgreSQL Native Partition
+
pg_partman
+
pg_cron
```

参数建议：

```text
premake = 3
retention = 12 months
```

架构如下：

应用程序
↓
INSERT
↓
PostgreSQL
↓
自动路由
↓
email_log_p2026_06
email_log_p2026_07
email_log_p2026_08

应用层完全感知不到分区的存在。

---

# 总结

pg_partman 解决了 PostgreSQL 分区表最麻烦的问题：

```text
自动创建分区
自动删除分区
自动维护分区
```
pg_partman 采用“巡检补缺”模式，而不是“定时创建”模式。
结合 pg_cron 后，可以实现完全自动化管理。

对于：

* 邮件日志
* MQ 消费记录
* API 访问日志
* 审计日志
* 任务执行记录

等典型时序数据场景，是 PostgreSQL 非常成熟且稳定的解决方案。
