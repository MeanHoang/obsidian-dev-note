---
name: Event-Driven Architecture Overview
description: Index + overview ngắn cho các note về Event-Driven Architecture
---

# Event-Driven Architecture — Overview

> Service giao tiếp với nhau qua **event** (async, loose coupling) thay vì **direct call** (sync, tight coupling).

## 📚 Notes trong folder này

- [[1 - The Hard Parts]] — 8 pitfall production của EDA + Outbox Pattern + Idempotency
- [[2 - Architectural Patterns]] — 4 pattern EDA theo Martin Fowler (Event Notification, ECST, Event Sourcing, CQRS)
- [[Message Broker]] — cơ chế transport message (Kafka, RabbitMQ, Pub/Sub)
- [[Pubsub]] — pattern publish-subscribe

## 🎯 Core concepts

- **Event**: một state change đã xảy ra (past tense: `OrderPaid`, `UserSignedUp`)
- **Producer**: service phát event
- **Consumer**: service lắng nghe và xử lý event
- **Broker**: hạ tầng truyền message (Kafka, Pub/Sub, SQS, RabbitMQ)
- **At-least-once**: default delivery guarantee → handler PHẢI idempotent
- **Eventual consistency**: trade-off của async — không strong consistency như sync

## 🔗 Related

- [[Microservices]] · [[Message Broker]] · [[Pubsub]]
- [[Idempotency]] · [[Ordering]]
- [[Monolithic]] (đối lập)

## ✍️ TODO

- [ ] Fill detailed overview với diagrams
- [ ] Liên kết với book notes (Fundamentals of Software Architecture)
- [ ] Thêm use case Joy Loyalty cụ thể
