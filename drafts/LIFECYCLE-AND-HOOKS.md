# Lifecycle and hooks

## Lifecycle of an HTTP request

1. Incoming request
2. Match route
3. Determine method
4. **HOOK** Exec onRequest hooks
5. Exec component handler
6. Render
7. **HOOK** Exec onSend hooks

## Hooks

- onRequest:
- onSend:
- onError:
