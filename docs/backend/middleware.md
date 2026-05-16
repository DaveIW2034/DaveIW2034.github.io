# FastAPI 中间件 添加 trace_id


**TraceIDMiddleware 中间件**
```py
from starlette.datastructures import Headers, MutableHeaders
from contextvars import ContextVar, Token
from uuid import uuid4


_trace_id_ctx_var: ContextVar[str] = ContextVar("trace_id", default="-")


def generate_trace_id() -> str:
    return uuid4().hex


def get_trace_id() -> str:
    return _trace_id_ctx_var.get()


def set_trace_id(trace_id: str) -> Token:
    return _trace_id_ctx_var.set(trace_id)


def reset_trace_id(token: Token) -> None:
    _trace_id_ctx_var.reset(token)



class TraceIDMiddleware:
    def __init__(self, app, header_name: str = "X-Trace-Id") -> None:
        self.app = app
        self.header_name = header_name
        self._header_name_lower = header_name.lower()

    async def __call__(self, scope, receive, send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        trace_id = headers.get(self._header_name_lower) or generate_trace_id()
        token = set_trace_id(trace_id)
        scope.setdefault("state", {})["trace_id"] = trace_id

        async def send_wrapper(message) -> None:
            if message["type"] == "http.response.start":
                response_headers = MutableHeaders(scope=message)
                response_headers[self.header_name] = trace_id
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            reset_trace_id(token)
```

**FastAPI 注册**

```py
from fastapi import FastAPI
from app.middleware.trace import TraceIDMiddleware

app = FastAPI(title="My FastAPI App")
app.add_middleware(TraceIDMiddleware)
```

## 思考
多服务时 trace_id 是非常好的追踪工具.
