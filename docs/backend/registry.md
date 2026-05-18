# 服务注册, 服务发现


服务注册:

```sh
“我来了，我在哪。”
```

服务发现:

```sh
“你在哪，我怎么找到你。”
```

## 下面是一个最小化服务注册 / 服务发现实现，接口层用 FastAPI。

## 1. 注册中心 registry.py

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI(title="Simple Service Registry")

services: Dict[str, List[dict]] = {}


class ServiceInstance(BaseModel):
    service_name: str
    host: str
    port: int


@app.post("/register")
def register(instance: ServiceInstance):
    services.setdefault(instance.service_name, [])

    item = {
        "host": instance.host,
        "port": instance.port,
    }

    if item not in services[instance.service_name]:
        services[instance.service_name].append(item)

    return {
        "message": "registered",
        "service_name": instance.service_name,
        "instances": services[instance.service_name],
    }


@app.get("/discover/{service_name}")
def discover(service_name: str):
    instances = services.get(service_name)

    if not instances:
        raise HTTPException(status_code=404, detail="service not found")

    return {
        "service_name": service_name,
        "instances": instances,
    }


@app.delete("/unregister")
def unregister(instance: ServiceInstance):
    instances = services.get(instance.service_name)

    if not instances:
        raise HTTPException(status_code=404, detail="service not found")

    item = {
        "host": instance.host,
        "port": instance.port,
    }

    if item in instances:
        instances.remove(item)

    return {
        "message": "unregistered",
        "service_name": instance.service_name,
        "instances": instances,
    }
```


## 2. 订单服务 order_service.py

```python
from fastapi import FastAPI
import requests

app = FastAPI(title="Order Service")

REGISTRY_URL = "http://localhost:8000"


@app.on_event("startup")
def register_service():
    requests.post(
        f"{REGISTRY_URL}/register",
        json={
            "service_name": "order-service",
            "host": "localhost",
            "port": 9001,
        },
    )


@app.get("/orders")
def list_orders():
    return [
        {"id": 1, "name": "订单A"},
        {"id": 2, "name": "订单B"},
    ]
```

## 3. 用户服务 user_service.py
```python
from fastapi import FastAPI
import requests
import random

app = FastAPI(title="User Service")

REGISTRY_URL = "http://localhost:8000"


@app.get("/user/orders")
def get_user_orders():
    result = requests.get(f"{REGISTRY_URL}/discover/order-service").json()

    instances = result["instances"]
    instance = random.choice(instances)

    url = f"http://{instance['host']}:{instance['port']}/orders"

    orders = requests.get(url).json()

    return {
        "called_service": url,
        "orders": orders,
    }
```


## 4. 调用效果

访问：
```sh
curl http://localhost:9002/user/orders
```

返回类似：
```sh
{
  "called_service": "http://localhost:9001/orders",
  "orders": [
    {"id": 1, "name": "订单A"},
    {"id": 2, "name": "订单B"}
  ]
}
```

这就是最小版：
```sh
order-service 启动后注册
user-service 调用前发现 order-service
再通过发现到的地址发起 HTTP 调用
```
![registry](./registry.png)
我上面搞了两个服务...竟然还负载均衡了 :)

## 思考
1. 心跳检测
2. 服务健康状态
3. 负载均衡
4. 服务下线
5. 多实例与集群
6. CAP 与注册中心一致性, 啥玩意是Cap?
7. 服务路由（Routing）
   灰度发布, 金丝雀发布.
8. 配置中心, （Configuration Center）
9. 服务鉴权与安全
10. 服务网格（Service Mesh）
11. 熔断 / 限流 / 重试
12. 服务链路追踪（Tracing）
13. 注册中心高可用
14. Kubernetes 化
15. 真正生产级体系

我建议学习顺序:
```sh
1. 心跳机制
2. 服务健康检查
3. 负载均衡
4. 注册中心持久化
5. 熔断限流
6. API Gateway
7. Docker 化
8. Kubernetes
9. Service Mesh
```

这上面都写了什么啊
