# System Design Implementation TODO

This document tracks the system design concepts to be implemented in the FarmerHub project to demonstrate advanced architectural knowledge.

## Phase 1: Core System Design
- [x] **Caching Strategy (Redis)**: Implement Cache-aside for the `GET /api/products` endpoint.
- [x] **Message Queues (RabbitMQ/BullMQ)**: Offload order processing (emails, inventory update) to background workers.
- [x] **Rate Limiting**: Implement a custom Token Bucket or Sliding Window rate limiter using Redis to protect the `/api/auth/login` and AI endpoints.
- [x] **Circuit Breaker**: Add resilience to the Gemini AI API integration using the `opossum` library.
- [x] **Database Indexing**: Add compound indexes for marketplace search and implement cursor-based pagination.

## Phase 2: Advanced Concepts
- [x] **Bloom Filter**: Implement a Bloom Filter to instantly check if an email/username is available during registration without hitting MongoDB.
- [ ] **Real-time Pub/Sub**: Use `Socket.io` or Redis Pub/Sub to push real-time order status updates to the consumer's dashboard.
- [ ] **Message Streams (Kafka/Redis Streams)**: Build a live "recent activity" feed for the Admin dashboard (e.g., "Farmer X just joined", "Order Y placed").
- [ ] **CQRS (Command Query Responsibility Segregation)**: Separate the product write model (MongoDB) from the product search read model (e.g., sync products to Elasticsearch or a dedicated Redis search index).
- [ ] **Event Sourcing**: Refactor the Order system. Instead of updating an order's status directly, store a ledger of events (`OrderCreated`, `PaymentVerified`, `OrderShipped`) and calculate the current status by replaying the events.

## Phase 3: Infrastructure & Algorithms (Theoretical/Config)
- [ ] **Consistent Hashing**: Configure a multi-node Redis cluster in Kubernetes to demonstrate how consistent hashing distributes cache keys evenly across nodes.
- [ ] **Gossip Protocol**: Deploy a distributed database (like Cassandra) or explore Redis Cluster gossip in Kubernetes to understand how nodes discover each other and maintain cluster health.
- [x] **Blob Storage (S3)**: Migrate image uploads from Cloudinary to AWS S3 using pre-signed URLs.

## Phase 4: Infrastructure as Code (Terraform)
- [ ] **AWS Provider & State Setup**: Configure the AWS provider and create an S3 bucket to store your `terraform.tfstate` file securely in the cloud (remote `backend "s3"` template ready in `terraform/versions.tf` — uncomment after bootstrapping the state bucket in your new AWS account).
- [x] **S3 Image Storage Bucket**: Write Terraform code (`terraform/s3.tf`) to create a versioned, encrypted S3 bucket with CORS and public media read policy.
- [x] **EC2 Provisioning & IAM (`terraform/ec2.tf`, `terraform/iam.tf`)**: Automate Ubuntu 24.04 EC2 provisioning with IMDSv2 enforced and a least-privilege IAM instance profile for S3 uploads.
- [x] **Automated Security Groups**: Write Terraform rules (`terraform/ec2.tf`) for ports `80` (HTTP), `443` (HTTPS), `5001` (Backend), and `22` (SSH).
- [x] **Server Bootstrapping (`user_data`)**: Automatically install Docker and Docker Compose (`docker-compose-v2`) when the EC2 instance boots.
