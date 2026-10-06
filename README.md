# DailyMart

A Next.js 16 + React 19 grocery/everyday shopping storefront.

## Run locally

```bash
pnpm install
pnpm dev
```

## Real payments

Copy `.env.example` to `.env.local` and add Razorpay test/live credentials. The browser only receives `RAZORPAY_KEY_ID`; the secret remains server-side.

## AI assistant

The assistant works with a catalog-aware local fallback. Add `OPENAI_API_KEY` to enable the optional server-side OpenAI response layer.

## API routes

- `POST /api/payments/create-order` — creates a Razorpay order
- `POST /api/payments/verify` — verifies the Razorpay signature
- `POST /api/orders/cod` — validates and creates a COD order reference
- `POST /api/ai` — shopping assistant
