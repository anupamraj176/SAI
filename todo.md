# System Design Implementation TODO

This document tracks the system design concepts to be implemented in the FarmerHub project to demonstrate advanced architectural knowledge.

## Phase 1: Core System Design
- [ ] **Caching Strategy (Redis)**: Implement Cache-aside for the `GET /api/products` endpoint.
- [ ] **Message Queues (RabbitMQ/BullMQ)**: Offload order processing (emails, inventory update) to background workers.
- [ ] **Rate Limiting**: Implement a custom Token Bucket or Sliding Window rate limiter using Redis to protect the `/api/auth/login` and AI endpoints.
- [ ] **Circuit Breaker**: Add resilience to the Gemini AI API integration using the `opossum` library.
- [ ] **Database Indexing**: Add compound indexes for marketplace search and implement cursor-based pagination.

## Phase 2: Advanced Concepts
- [ ] **Bloom Filter**: Implement a Bloom Filter to instantly check if an email/username is available during registration without hitting MongoDB.
- [ ] **Real-time Pub/Sub**: Use `Socket.io` or Redis Pub/Sub to push real-time order status updates to the consumer's dashboard.
- [ ] **Message Streams (Kafka/Redis Streams)**: Build a live "recent activity" feed for the Admin dashboard (e.g., "Farmer X just joined", "Order Y placed").
- [ ] **CQRS (Command Query Responsibility Segregation)**: Separate the product write model (MongoDB) from the product search read model (e.g., sync products to Elasticsearch or a dedicated Redis search index).
- [ ] **Event Sourcing**: Refactor the Order system. Instead of updating an order's status directly, store a ledger of events (`OrderCreated`, `PaymentVerified`, `OrderShipped`) and calculate the current status by replaying the events.

## Phase 3: Infrastructure & Algorithms (Theoretical/Config)
- [ ] **Consistent Hashing**: Configure a multi-node Redis cluster in Kubernetes to demonstrate how consistent hashing distributes cache keys evenly across nodes.
- [ ] **Gossip Protocol**: Deploy a distributed database (like Cassandra) or explore Redis Cluster gossip in Kubernetes to understand how nodes discover each other and maintain cluster health.
- [ ] **Blob Storage (S3)**: Migrate image uploads from Cloudinary to AWS S3 using pre-signed URLs.
