# 🎯 System Design & Recruiter Interview Guide

This guide equips you with technical explanations and responses to expected system design and architecture questions when presenting **Anshita's Ride-Sharing Platform** to recruiters, technical screeners, or senior engineering interviewers.

---

## 💡 1. Key System Design Architecture Decisions

### Q1: Why did you choose a Microservices architecture instead of a Monolith?
> **Answer**:
> *"A ride-sharing platform has distinct functional boundaries with vastly different scaling requirements:
> - **Driver Location Ingestion**: High write volume (streaming GPS every few seconds).
> - **Trip Calculation**: CPU and I/O intensive (fetching route geometries & computing fares).
> - **Payment Processing**: High reliability & third-party API dependency (Stripe).
>
> By decoupling into independent Go microservices (`api-gateway`, `trip-service`, `driver-service`, `payment-service`), each service can scale independently in Kubernetes. If the payment gateway experiences latency, it doesn't degrade driver location tracking or map rendering."*

---

### Q2: Why did you use gRPC for internal service communication and REST/WebSockets for the edge?
> **Answer**:
> *"For edge communication (Rider/Driver to API Gateway), I used **HTTP REST** for stateless requests and **WebSockets** for full-duplex real-time streaming (location updates and push notifications).
>
> For inter-service communication (API Gateway to Trip/Driver Services), I used **gRPC over HTTP/2**:
> 1. **Protobuf Schemas**: Strongly-typed contract definitions (`.proto`) prevent API mismatch bugs.
> 2. **Binary Performance**: Protocol Buffers serialize up to 5x faster than JSON and consume less network bandwidth.
> 3. **HTTP/2 Multiplexing**: Multiple gRPC requests share a single TCP connection, reducing socket overhead."*

---

### Q3: Why use RabbitMQ instead of direct HTTP calls between microservices?
> **Answer**:
> *"Direct synchronous HTTP calls create tight coupling and cascading failures. If `payment-service` goes down, direct HTTP calls would cause `driver-service` to fail.
>
> With **RabbitMQ AMQP**:
> - **Decoupling & Temporal Buffering**: When a driver accepts a trip, `driver-service` publishes a `driver.cmd.trip_accept` event. `payment-service` consumes it asynchronously. If `payment-service` is restarting, the message stays safely queued in RabbitMQ.
> - **Message Retries**: We implemented retry logic (3-attempt exponential backoff) for message processing resilience."*

---

### Q4: How does Distributed Tracing with Jaeger work across microservices?
> **Answer**:
> *"I implemented OpenTelemetry context propagation. When an HTTP request enters `api-gateway`, a global `TraceID` is generated. 
> 
> As the gateway makes a gRPC call to `trip-service` or publishes an AMQP message to RabbitMQ, the `TraceID` is injected into the gRPC metadata and AMQP headers. The downstream service extracts the `TraceID` and appends its own child spans. In Jaeger, this gives us a unified, end-to-end timeline trace spanning all microservices."*

---

### Q5: How do you handle database failures in `trip-service`?
> **Answer**:
> *"We implemented a resilient repository design pattern. During startup, `trip-service` attempts to connect to MongoDB. If MongoDB is unavailable or times out, the service logs a fallback warning and seamlessly switches to an **In-Memory Repository** (`inmem.go`), ensuring the core ride preview and trip creation workflows remain 100% operational without crashing."*

---

## 🛠️ 2. Microservice Technologies Matrix

| Architectural Problem | Solution Implemented | Location in Codebase |
|---|---|---|
| Edge Routing & WebSocket Hub | Go Gorilla WebSockets & HTTP Mux | [services/api-gateway/ws.go](file:///c:/Profile/GO/rider-share/ride-sharing/services/api-gateway/ws.go) |
| Inter-Service Type Safety | Protocol Buffers (`proto/trip.proto`, `proto/driver.proto`) | [proto/trip.proto](file:///c:/Profile/GO/rider-share/ride-sharing/proto/trip.proto) |
| Event Messaging | RabbitMQ AMQP Topic Exchanges | [shared/messaging/rabbitmq.go](file:///c:/Profile/GO/rider-share/ride-sharing/shared/messaging/rabbitmq.go) |
| Distributed Latency Profiling | OpenTelemetry & Jaeger Collector | [shared/tracing/tracing.go](file:///c:/Profile/GO/rider-share/ride-sharing/shared/tracing/tracing.go) |
| Real Stripe Payment Link | Stripe Go SDK Checkout Sessions | [services/payment-service/internal/infrastructure/stripe/stripe.go](file:///c:/Profile/GO/rider-share/ride-sharing/services/payment-service/internal/infrastructure/stripe/stripe.go) |
| Container Deployment | Docker & Kubernetes Manifests | [infra/development/k8s](file:///c:/Profile/GO/rider-share/ride-sharing/infra/development/k8s) |
