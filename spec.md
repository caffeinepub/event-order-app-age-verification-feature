# Event Order App

## Current State
App allows users to select a venue, browse venue-specific menus (food, drinks, alcohol), add items to a cart, verify age for alcohol, and place orders. The checkout flow currently only does age verification -- no payment is collected.

## Requested Changes (Diff)

### Add
- Stripe payment step after age verification in the checkout flow
- A payment form where users enter card details to pay for their order
- Order confirmation with total amount charged

### Modify
- AgeVerificationModal: after successful age verification (or if no alcohol), redirect to a payment step instead of immediately completing the order
- Checkout flow: age verification -> Stripe payment -> order confirmation

### Remove
- Nothing removed

## Implementation Plan
1. Select Stripe component
2. Generate updated backend with Stripe payment intent support
3. Update AgeVerificationModal and add a PaymentModal component
4. Wire the checkout flow: cart -> age check (if needed) -> Stripe payment -> success
