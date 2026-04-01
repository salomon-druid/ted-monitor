# TED Monitor Setup Guide

## Current Status
- ✅ Web application deployed to Vercel
- ✅ Auth page with magic link login
- ✅ Dashboard with upgrade banner
- ✅ i18n (DE/EN/FR) complete
- ✅ Email alerts backend code
- ✅ Stripe billing backend code
- ⚠️ Environment variables need configuration
- ⚠️ Supabase tables need creation
- ⚠️ Stripe products need setup

## Step 1: Configure Environment Variables in Vercel

Go to https://vercel.com → ted-monitor-six → Settings → Environment Variables

Add the following variables:

### Required for Basic Functionality
```
NEXT_PUBLIC_SUPABASE_URL=https://unrclhgwtqbptcuqbhni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase dashboard>
NEXT_PUBLIC_SITE_URL=https://ted-monitor-six.vercel.app
```

### Required for Email Alerts
```
RESEND_API_KEY=re_<get from resend.com>
ALERT_FROM_EMAIL=TenderWatch <alerts@ted-monitor.com>
ALERT_CRON_SECRET=<generate random secret>
```

### Required for Stripe Billing
```
STRIPE_SECRET_KEY=sk_live_<get from stripe.com>
STRIPE_WEBHOOK_SECRET=whsec_<get from stripe.com>
STRIPE_PRICE_STARTER=price_<get from stripe.com>
STRIPE_PRICE_PROFESSIONAL=price_<get from stripe.com>
STRIPE_PRICE_ENTERPRISE=price_<get from stripe.com>
```

## Step 2: Create Supabase Tables

Go to https://supabase.com → ted-monitor project → SQL Editor

Run the migration SQL:
```sql
-- From: ted-monitor/web/supabase/migrations/002_alert_system.sql
```

## Step 3: Setup Stripe Products

Go to https://dashboard.stripe.com → Products

Create 3 products:
1. **Starter** - €79/month
2. **Professional** - €199/month  
3. **Enterprise** - €499/month

Copy the Price IDs to Vercel environment variables.

## Step 4: Setup Resend for Email Alerts

Go to https://resend.com → API Keys

Create an API key and add to Vercel environment variables.

## Step 5: Test the Setup

1. Visit https://ted-monitor-six.vercel.app
2. Click "Kostenlos testen"
3. Enter email and check for magic link
4. Login and check dashboard
5. Verify upgrade banner shows

## Revenue Potential

With proper setup:
- **Starter**: €79/month × 50 customers = €3,950/month
- **Professional**: €199/month × 20 customers = €3,980/month
- **Enterprise**: €499/month × 5 customers = €2,495/month
- **Total Potential**: €10,425/month

## Next Steps

1. Configure environment variables (30 minutes)
2. Create Supabase tables (5 minutes)
3. Setup Stripe products (15 minutes)
4. Setup Resend (10 minutes)
5. Test complete flow (15 minutes)

**Total Time**: ~75 minutes to full revenue generation

---
*Created: April 1, 2026, 13:38 CEST*