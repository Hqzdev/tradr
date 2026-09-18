package dev.tradr.backend.common.api;

// Единый формат ошибки для всего API — фронт всегда знает, что искать
// { "message": "..." }, не подстраивается под разные контроллеры.
public record ErrorResponse(String message) {}
