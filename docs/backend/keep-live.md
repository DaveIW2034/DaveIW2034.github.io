# Peewee 探活

## 为什么 PeeWee 链接 PostgreSQL 没有心跳保活机制.

```sh
Peewee 无 pool 场景

db.is_closed() 

只能判断: Peewee 是否主动 close() 过.

不能判断: PostgreSQL 还活着吗.

凌晨没流量
↓
连接被 PostgreSQL 干掉
↓
早上第一波请求炸

请求前保证探活
```