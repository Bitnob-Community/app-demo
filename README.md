# Bitnob API Demo

A comprehensive demonstration of Bitnob's payment API capabilities, showcasing Bitcoin, stablecoins, and financial infrastructure integration across multiple programming languages.

## 🚀 About This Demo

This demo application shows how to integrate Bitnob's payment infrastructure into your applications across multiple programming languages. It features real-world implementations of cryptocurrency payments, virtual card issuing, and cross-border financial services for developers building fintech solutions.

## 🌟 Multi-Language Implementation

This repository contains complete implementations of Bitnob's API in multiple programming languages, allowing developers to explore integration patterns in their preferred technology stack:

### 🟨 TypeScript/Next.js (`/typescript/labs/`)
- **Framework**: Next.js 15 with App Router
- **Features**: Modern React UI, server-side API routes, TailwindCSS styling
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Built-in authentication patterns
- **Best For**: Full-stack web applications, modern frontend development

### 🦀 Rust (`/rust/`)
- **Framework**: Axum web framework
- **Features**: High-performance async processing, strong type safety
- **Architecture**: Clean handler-based structure
- **Best For**: High-throughput services, systems programming, performance-critical applications

### 🐹 Go (`/go/`)
- **Framework**: Gin web framework
- **Features**: Simple, fast HTTP server with clean API design
- **Architecture**: Lightweight, minimal setup
- **Best For**: Microservices, cloud-native applications, simple web APIs

### 🐘 PHP (`/php/`)
- **Framework**: Native PHP with cURL
- **Features**: Simple routing, environment configuration, comprehensive error handling
- **Architecture**: Lightweight, no external dependencies
- **Best For**: Traditional web applications, legacy system integration, shared hosting

### 🐍 Python (`/python/`)
- **Framework**: Flask web framework
- **Features**: Simple REST API, environment configuration, CORS support
- **Dependencies**: Minimal setup with Flask, requests, and python-dotenv
- **Best For**: Data science integration, rapid prototyping, AI/ML applications, microservices

Each implementation demonstrates the same core functionality while leveraging language-specific best practices and ecosystem strengths.

## 🎯 API Features Demonstrated

### Core Payment Technologies
- **Bitcoin & Lightning Network** - Instant, low-fee payments at scale
- **USDT/Stablecoins** - Digital dollars for stable value transfers
- **Cross-border Payments** - Seamless money movement across Africa
- **Virtual Card Issuing** - Programmatic card creation and management

### Implementation Examples
- **Payment Processing** - Accept and process crypto payments
- **Currency Conversion** - Convert between crypto and local currencies
- **Disbursement Systems** - Send payments to bank accounts and mobile money
- **Card Management** - Issue, fund, and manage virtual cards

## 💻 Demo Features

This demo includes complete implementations of:

1. **Payment Gateway** - Accept crypto payments and convert to local currency
2. **Disbursement System** - Send payments to mobile money and bank accounts
3. **Card Program** - Issue virtual cards funded by cryptocurrency
4. **Trading System** - Buy/sell cryptocurrency with automatic conversions

## 🛠️ Getting Started

Choose your preferred programming language implementation:

- **[TypeScript](typescript/labs/README.md)** - Modern web application with React UI
- **[Rust](rust/README.md)** - High-performance server implementation
- **[Go](go/README.md)** - Simple, fast web API server
- **[PHP](php/README.md)** - Native PHP implementation with minimal dependencies
- **[Python](python/README.md)** - Flask web framework with simple REST API

Each directory contains its own README with specific setup instructions and documentation.

## 🔑 API Setup

Before running any implementation, you'll need Bitnob API credentials:

1. **Create a Bitnob Sandbox Account** at [https://sandboxapp.bitnob.co/accounts/signup](https://sandboxapp.bitnob.co/accounts/signup)
2. **Get API Credentials** from Settings → API Keys in your dashboard
3. **Configure your chosen implementation** using the README in its directory

## 📚 API Resources

### Documentation
- [API Documentation](https://www.bitnob.dev/docs/genesis/overview)
- [API Reference](https://www.bitnob.dev/api-reference/authentication)
- [Developer Dashboard](https://sandboxapp.bitnob.co)

### Support
- **GitHub**: Open issues in this repository
- **Email**: developers@bitnob.com
- **Telegram**: [Join our developer community](https://t.me/+QZEsH1DBhC04YjE0)

## 🏗️ Architecture

This demo includes:
- RESTful API integrations
- Webhook handling for real-time updates
- Secure payment processing
- Error handling and retry logic
- Production-ready code patterns

## 📄 License

This demo is open source and available under the MIT License. Feel free to use, modify, and share.

---

**Ready to integrate Bitnob's payment infrastructure?** Run this demo locally and start building your financial application today.

[View API Docs →](https://www.bitnob.dev/docs/genesis/overview)