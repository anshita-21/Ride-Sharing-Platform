# 🎬 Live Demonstration Playbook: Anshita's Ride-Sharing Platform

This document is your step-by-step presentation script to demonstrate **Anshita's Ride-Sharing Platform** in front of recruiters, hiring managers, or a technical audience.

---

## 🖥️ 1. Screen Setup & Environment Prep (Before Starting)

Open the following 4 browser tabs side-by-side:

| Tab # | Application | URL | Purpose |
|---|---|---|---|
| **Tab 1** | **Rider UI** | [`http://localhost:3000`](http://localhost:3000) | Displays the rider map, OSRM routing, and ride booking |
| **Tab 2** | **Driver UI** | [`http://localhost:3000`](http://localhost:3000) | Displays driver location streaming (**Anshita Verma**) & trip acceptance |
| **Tab 3** | **Jaeger Tracing** | [`http://localhost:16686`](http://localhost:16686) | Demonstrates OpenTelemetry distributed tracing & latency profiling |
| **Tab 4** | **RabbitMQ Management** | [`http://localhost:15672`](http://localhost:15672) | Demonstrates real-time event broker queue message rates |

---

## 🎙️ 2. The 30-Second Elevator Pitch

> *"Hi! I engineered **Anshita's Ride-Sharing Platform**, an end-to-end, event-driven Uber-style microservices application built with Go, Kubernetes, Docker, RabbitMQ, Jaeger, Stripe, and Next.js.*
>
> *Instead of a monolithic architecture, I designed 5 decoupled Go microservices that communicate via **high-speed gRPC** for synchronous calls and **RabbitMQ AMQP** for asynchronous event messaging. The platform handles real-time map routing in Indian Rupees (₹), driver matching, distributed tracing, and live Stripe payments."*

---

## 🎬 3. Step-by-Step Live Demonstration Script

### Step 1: Show the Kubernetes Cluster & Microservices
1. **Action**: Open terminal and run `kubectl get pods` (or show Tilt Dashboard at `:10350`).
2. **What to Say**:
   > *"As you can see, all 7 microservices are running live inside a Kubernetes cluster managed via containerized deployments: API Gateway, Trip Service, Driver Service, Payment Service, Web Frontend, RabbitMQ, and Jaeger."*

---

### Step 2: Driver Registration & Live Location Streaming
1. **Action**: Go to **Tab 2 (Driver UI)** $\rightarrow$ Click **"I Want to Drive"** $\rightarrow$ Click **"Start Driving"**.
2. **What to Say**:
   > *"When the driver clicks 'Start Driving', the Next.js frontend opens a WebSocket connection to the API Gateway. The Gateway invokes a gRPC call to our Driver Service, registering driver **Anshita Verma** and streaming live GPS coordinates near Sarjapur, Bangalore."*

---

### Step 3: Map Routing & Real-Time Fare Estimation (in ₹)
1. **Action**: Go to **Tab 1 (Rider UI)** $\rightarrow$ Click **"I Need a Ride"** $\rightarrow$ Click a destination point on the Sarjapur map.
2. **What to Say**:
   > *"When the rider picks a destination, the API Gateway sends a gRPC request to the Trip Service. The Trip Service queries the OSRM routing engine over HTTP to calculate exact road geometry, distance, and duration, and computes real-time fares in **Indian Rupees (₹)** across 4 vehicle tiers: SUV, Sedan, Van, and Luxury."*

---

### Step 4: Async Driver Matching via RabbitMQ
1. **Action**: On **Tab 1 (Rider UI)**, select **Sedan** and click **"Request Ride"**.
2. **Action**: Switch immediately to **Tab 4 (RabbitMQ Dashboard)** $\rightarrow$ Show the message queue spike on `driver_service_queue`.
3. **What to Say**:
   > *"When a ride is requested, the API Gateway doesn't block the request. Instead, it publishes an asynchronous `trip.cmd.create` event to RabbitMQ. The Driver Service consumes this event from `driver_service_queue` and instantly matches nearby driver **Anshita Verma**."*

---

### Step 5: Driver Acceptance & Real Stripe Checkout
1. **Action**: Switch to **Tab 2 (Driver UI)** $\rightarrow$ Click **"Accept Ride"**.
2. **Action**: Switch back to **Tab 1 (Rider UI)** $\rightarrow$ Point out the green **"Pay ₹[Amount] (INR)"** button $\rightarrow$ Click it to open the official **Stripe Checkout Page**.
3. **What to Say**:
   > *"When driver **Anshita Verma** accepts the ride, the Driver Service publishes a `driver.cmd.trip_accept` event. The Payment Service consumes this message and calls the official Stripe API using secret keys to generate a Checkout Session. The session ID is broadcasted to the Rider via WebSocket, rendering the Stripe Payment button."*

---

### Step 6: Distributed Tracing & Observability with Jaeger
1. **Action**: Switch to **Tab 3 (Jaeger Tracing)** $\rightarrow$ Select Service **`api-gateway`** $\rightarrow$ Click **Find Traces** $\rightarrow$ Click open the **`handleTripPreview`** trace.
2. **What to Say**:
   > *"Finally, for production observability, I integrated OpenTelemetry distributed tracing with Jaeger. In this trace waterfall, you can see the end-to-end request latency: the API Gateway handles the request in 543ms, of which 517ms is spent in the Trip Service querying the OSRM router. This allows us to pinpoint latency bottlenecks across microservices instantly."*
