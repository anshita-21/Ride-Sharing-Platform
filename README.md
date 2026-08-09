# Anshita's Microservices Ride-Sharing Platform

Welcome to **Anshita's Ride-Sharing Platform** — an end-to-end Uber-style backend microservices and web application built with Go, Docker, Kubernetes, RabbitMQ, Jaeger, Stripe, and Next.js.

Designed & Engineered by **Anshita Verma**.

---

## 🏗️ Architecture Overview

The system consists of 5 decoupled Go microservices and 1 Next.js web application, orchestrated via Kubernetes:

1. **`api-gateway`** (Port `8081`): Entry point for HTTP requests and WebSocket connections (`/ws/riders` & `/ws/drivers`). Routes requests to microservices over gRPC and AMQP.
2. **`trip-service`** (Port `9093`): Calculates trip routes using OSRM, generates fare estimates in Indian Rupees (₹), and manages trip lifecycles.
3. **`driver-service`** (Port `9092`): Manages driver registrations, location streaming, and driver matching.
4. **`payment-service`** (Port `9094`): Integrates with Stripe Checkout to create payment sessions and handle payment webhooks.
5. **`web`** (Port `3000`): Next.js interactive frontend with live map tracking for Riders and Drivers.
6. **Infrastructure Services**:
   - **`rabbitmq`** (Port `5672` / `15672`): Message broker for event-driven asynchronous communication.
   - **`jaeger`** (Port `16686`): Distributed tracing across all microservices.

---

## 🚀 Running Locally with Tilt

```powershell
tilt up
```

- **Rider & Driver UI**: [http://localhost:3000](http://localhost:3000)
- **API Gateway**: [http://localhost:8081](http://localhost:8081)
- **RabbitMQ Management Dashboard**: [http://localhost:15672](http://localhost:15672) (User: `guest`, Pass: `guest`)
- **Jaeger Distributed Tracing**: [http://localhost:16686](http://localhost:16686)
- **Tilt Dashboard**: [http://localhost:10350](http://localhost:10350)
