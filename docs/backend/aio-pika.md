# Python RabbitMQ 学习实践（aio-pika）

## 为什么学习 RabbitMQ

适用于：

- 异步邮件
- 短信通知
- 订单处理
- 数据同步
- 削峰填谷
- 事件驱动架构

传统同步流程：

```text
请求
 ├─ 数据库
 ├─ 邮件
 ├─ 短信
 └─ 第三方接口
```

消息队列解耦：

```text
请求
 ├─ 数据库
 └─ RabbitMQ

Consumer
 ├─ 邮件
 ├─ 短信
 └─ 风控
```

---

# RabbitMQ 核心模型

```text
Producer
    ↓
Exchange
    ↓
Queue
    ↓
Consumer
```

核心组件：

| 组件 | 作用 |
|--------|--------|
| Producer | 生产消息 |
| Exchange | 路由消息 |
| Queue | 存储消息 |
| Consumer | 消费消息 |

---

# aio-pika

安装：

```bash
pip install aio-pika
```

特点：

- asyncio 原生支持
- 自动重连
- Publisher Confirm
- 类型提示完整
- 适合 FastAPI

---

# 学习路线

## 第一阶段：Producer / Consumer

目标：

- 建立连接
- 发送消息
- 接收消息

核心 API：

```python
aio_pika.connect_robust()
channel()
declare_queue()
publish()
consume()
```

---

## 第二阶段：ACK

消息确认机制。

```python
await message.ack()
```

失败重试：

```python
await message.reject(
    requeue=True
)
```

流程：

```text
成功
 └─ ack

失败
 └─ reject
        ├─ requeue=True
        └─ requeue=False
```

---

## 第三阶段：QoS

限制消费者并发。

```python
await channel.set_qos(
    prefetch_count=5
)
```

建议：

| 场景 | prefetch |
|--------|--------|
| 普通业务 | 20~50 |
| 重任务 | 1~5 |
| AI任务 | 1 |

---

## 第四阶段：Direct Exchange

精确路由。

```text
order.created
order.paid
order.cancelled
```

```python
ExchangeType.DIRECT
```

---

## 第五阶段：Topic Exchange

事件驱动。

```text
order.*.paid
user.*
email.*
```

```python
ExchangeType.TOPIC
```

---

## 第六阶段：异步邮件

架构：

```text
用户注册
    ↓
RabbitMQ
    ↓
Email Worker
    ↓
SMTP
```

消息体：

```json
{
  "to": "user@test.com",
  "subject": "Welcome"
}
```

---

## 第七阶段：Publisher Confirm

保证消息成功进入 RabbitMQ。

```python
channel = await connection.channel(
    publisher_confirms=True
)
```

生产环境建议：

```text
durable queue
persistent message
publisher confirm
manual ack
```

---

## 第八阶段：死信队列（DLQ）

消费失败进入死信队列。

```text
业务队列
    ↓
消费失败
    ↓
DLQ
```

配置：

```python
{
    "x-dead-letter-exchange": "email.dlx",
    "x-dead-letter-routing-key": "email.dead"
}
```

---

## 第九阶段：订单超时取消

实现：

```text
订单创建
    ↓
Delay Queue
    ↓
TTL
    ↓
DLQ
    ↓
取消订单
```

配置：

```python
{
    "x-message-ttl": 1800000
}
```

30 分钟后自动进入超时队列。

---

# 常见错误

## 登录失败

错误：

```text
Login was refused using authentication mechanism AMQPLAIN
```

原因：

```text
guest 用户只能 localhost 登录
```

解决：

```bash
rabbitmqctl add_user admin admin123

rabbitmqctl set_user_tags admin administrator

rabbitmqctl set_permissions \
-p / \
admin \
".*" \
".*" \
".*"
```

连接：

```text
amqp://admin:admin123@localhost/
```

---

## PRECONDITION_FAILED

错误：

```text
inequivalent arg
'x-dead-letter-exchange'
for queue 'email.queue'
```

原因：

第一次：

```python
email.queue
x-dead-letter-exchange=email.dlx
```

后面：

```python
email.queue
没有 DLX 参数
```

RabbitMQ 不允许同名队列参数不一致。

解决：

删除旧队列：

```bash
rabbitmqctl delete_queue email.queue
```

或者保持声明一致：

```python
await channel.declare_queue(
    "email.queue",
    durable=True,
    arguments={
        "x-dead-letter-exchange": "email.dlx",
        "x-dead-letter-routing-key": "email.dead"
    }
)
```

---

# 推荐实践项目

## 入门

- Hello RabbitMQ
- Producer / Consumer

## 进阶

- 异步邮件系统
- 日志收集系统
- 订单事件系统

## 高级

- 死信队列
- 延迟队列
- 订单超时取消
- 分布式任务系统

---

# 最终目标

掌握：

- 消息可靠投递
- 消息可靠消费
- ACK机制
- Publisher Confirm
- DLQ
- TTL
- 幂等设计
- 重试机制
- 事件驱动架构

从：

```text
会用 RabbitMQ
```

成长为：

```text
能设计可靠消息系统
```