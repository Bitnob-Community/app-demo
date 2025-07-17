Hands-on Technical Workshop

This hands-on technical workshop is designed to give developers practical experience with the Bitnob API suite, accepting crypto, triggering off-ramp payments (cross-border), card issuing, and integrations with LLMs. 

Across multiple lab sessions, participants will implement real-world flows, troubleshoot in real time, and prepare for independent innovation during the upcoming hackathon.
1. 00:00–00:10 – Welcome & Setup
Topics Covered:
Introduction to the session goals
Overview of tool requirements
Environment configuration for API testing
Tasks:
Retrieve and configure Bitnob API keys

2. 00:10–00:15 – Bitnob API Overview
Topics Covered:
Off-ramp (payouts): Enable users to withdraw crypto (like USDT or BTC) into local fiat currencies like UGX, NGN etc
Trading API (USDT and BTC): Buy, sell, and swap between BTC, USDT, and local currencies via the API.
Lightning payments: Support instant, low-fee Bitcoin payments using Lightning.
Virtual card issuing: Create virtual USD cards for spending crypto balances online (funded via USDT).


3. 00:15–01:00 – Lab 1: USDT to UGX Flow
Objective: Design a flow to initiate a UGX payout triggered by a USDT deposit.
Topics Covered:
Depositing USDT to a USDT address
Payouts in UGX to mobile money
Handling and responding to webhooks
Error handling and transaction status checks

4. 01:00–01:10 – Break

5. 01:10–02:00 – Lab 2: Card Issuing
Objective: Design a flow to create and fund a virtual card from USDT deposit.
Topics Covered:
Creating and managing virtual USD cards
Funding cards using USDT
Making a card transaction (optional)

6. 02:00–02:10 – Break

7. 02:10–02:15 – Designing Your Own Lab
Objective: How to design your custom flow for your users.
Topics Covered:
Identifying use cases relevant to your region/team
How to define "done" for a custom integration
What makes a good flow for a hackathon


8. 02:15–03:00 – Lab 3: Vibe Session – Hands‑on with MCP Servers & LLM Integration
Topics Covered:
Overview of MCP (Model Context Protocol) architecture
Setting up Goose and Gemini locally
Calling Bitnob APIs through LLMs (e.g., GPT or Gemini via middleware)
Tasks:
Authenticate and route requests via MCP to Bitnob
Use a local LLM prompt to trigger API calls (e.g., “Send 10 USDT to Uganda”)
Test different natural language prompts



9. 03:00–03:10 – Break

10. 03:10–03:55 – Open Floor
Topics Covered:
Debugging labs
Exploring edge cases and complex API flows
Handling real-world constraints (KYC, rate limits, currency slippage)


Tasks (Flexible):
Share your challenges during labs
Work on improvements 
Deep dive on any integration




11. 03:55–04:00 – Wrap & Next Steps
Topics Covered:
Post-workshop resources
Repos and sandbox environments
Telegram community invites


Tasks:
Join the dev community channel
Bookmark docs and sample Postman collections
Confirm next steps for those continuing to build




Prep & Materials:
• Git + code editor
• Postman
• Node.js
• Bitnob API docs access: https://bitnob.dev



