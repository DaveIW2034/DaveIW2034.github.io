# InfluxDB 快速入门与核心概念

## 什么是 InfluxDB

InfluxDB 是一个专门用于存储和分析**时间序列数据（Time Series Data）**的数据库。

典型场景：

* 服务器监控（CPU、内存、磁盘）
* 应用监控（QPS、TPS、响应时间）
* RabbitMQ 指标监控
* IoT 设备数据采集
* 日志指标统计

---

# Docker Compose 安装

```yaml
services:
  influxdb:
    image: influxdb:2.7
    container_name: influxdb

    ports:
      - "8086:8086"

    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: admin123456
      DOCKER_INFLUXDB_INIT_ORG: my-org
      DOCKER_INFLUXDB_INIT_BUCKET: metrics
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: my-super-token

    volumes:
      - ./influxdb/data:/var/lib/influxdb2
      - ./influxdb/config:/etc/influxdb2
```

启动：

```bash
docker compose up -d
```

访问：

```text
http://localhost:8086
```

---

# InfluxDB 核心概念

## Bucket

类似 MySQL Database。

```text
metrics
```

---

## Measurement

类似 MySQL Table。

```text
cpu_usage
mq_consumer
api_request
```

---

## Tag

用于过滤查询。

```python
.tag("host", "server01")
.tag("env", "prod")
```

特点：

* 字符串类型
* 自动建立索引
* 适合作为查询条件

常见 Tag：

```text
host
service
env
region
queue
```

---

## Field

真正存储的数据。

```python
.field("cpu", 85.5)
.field("memory", 70.2)
```

支持：

```text
float
int
string
bool
```

注意：

同一个 Measurement 下，同名 Field 类型必须一致。

错误示例：

```text
第一次：
value=85.5

第二次：
value=80
```

会报：

```text
field type conflict
```

---

## Timestamp

每条数据必须带时间。

```python
.time(datetime.utcnow())
```

---

# Point 结构

```python
Point("cpu_usage")
.tag("host", "server01")
.tag("env", "prod")
.field("value", 85.5)
```

对应：

```text
Measurement: cpu_usage

Tags:
host=server01
env=prod

Fields:
value=85.5

Timestamp:
2026-06-06 12:00:00
```

---

# Tag 与 Field 的区别

Tag：

```text
用于筛选
有索引
```

Field：

```text
用于统计
无索引
```

推荐：

```python
Point("api_request")
.tag("service", "user")
.tag("env", "prod")

.field("cost_ms", 35.5)
.field("status_code", 200)
```

---

# 一个 Point 可以有多个 Tag

```python
Point("api_request")
.tag("service", "user")
.tag("host", "server01")
.tag("env", "prod")
```

查询：

```flux
|> filter(fn: (r) =>
    r.service == "user" and
    r.env == "prod"
)
```

---

# 一个 Point 可以有多个 Field

```python
Point("system")
.tag("host", "server01")

.field("cpu", 65.2)
.field("memory", 78.5)
.field("disk", 40.1)
```

表示同一时刻的多个指标。

---

# Python 写入示例

安装：

```bash
pip install influxdb-client
```

写入 100 条数据：

```python
import random
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

with InfluxDBClient(
    url="http://localhost:8086",
    token="my-super-token",
    org="my-org"
) as client:

    write_api = client.write_api(
        write_options=SYNCHRONOUS
    )

    points = []

    for _ in range(100):
        points.append(
            Point("cpu_usage")
            .tag("host", "server01")
            .field("value", float(random.randint(20, 90)))
        )

    write_api.write(
        bucket="metrics",
        record=points
    )
```

---

# InfluxDB vs MySQL/PostgreSQL

| 对比项  | InfluxDB | MySQL/PostgreSQL |
| ---- | -------- | ---------------- |
| 数据类型 | 时序数据     | 业务数据             |
| 查询核心 | 时间范围     | 主键/条件            |
| 更新数据 | 少        | 多                |
| 聚合统计 | 强        | 一般               |
| Join | 弱        | 强                |
| 事务   | 弱        | 强                |

适合：

```text
MySQL/PostgreSQL
    用户、订单、商品

InfluxDB
    CPU、QPS、TPS、监控指标
```

---

# InfluxDB vs ClickHouse

| 对比项  | InfluxDB | ClickHouse |
| ---- | -------- | ---------- |
| 定位   | 时序数据库    | OLAP分析数据库  |
| 查询语言 | Flux     | SQL        |
| 指标监控 | 优秀       | 良好         |
| 日志分析 | 一般       | 优秀         |
| JOIN | 弱        | 强          |
| BI分析 | 一般       | 优秀         |

适用场景：

```text
InfluxDB
    监控系统
    Prometheus替代
    RabbitMQ指标

ClickHouse
    日志分析
    用户行为分析
    BI报表
```

---

# RabbitMQ + InfluxDB 实践

记录消费者指标：

```python
Point("mq_consumer")
.tag("queue", "email.queue")
.tag("service", "mail")

.field("cost_ms", 123)
.field("success", 1)
.field("retry_count", 0)
```

监控内容：

```text
消费TPS
消费耗时
失败率
队列堆积
```

推荐架构：

```text
Producer
    ↓
RabbitMQ
    ↓
Consumer
    ↓
InfluxDB
    ↓
Grafana
```

---

# 总结

```text
Bucket
    ↓
Measurement
    ↓
Tag（查询条件）
    ↓
Field（指标数据）
    ↓
Timestamp（时间）
```

一句话理解：

InfluxDB 专门用于存储和分析时间序列数据，适合监控、指标统计和实时观测场景；MySQL/PostgreSQL 用于业务数据；ClickHouse 用于海量分析和报表场景。
