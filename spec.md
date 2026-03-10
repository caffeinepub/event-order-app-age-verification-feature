# Event Order App - Age Verification Feature

## Overview
Add age verification functionality to an existing event ordering application to restrict alcohol purchases to users 21 years or older.

## Core Features

### Age Verification System
- Display an age verification prompt when users attempt to checkout with alcohol items in their cart
- Require users to confirm they are 21 years or older before proceeding
- Block checkout process if user declines age verification or fails to confirm eligibility
- Only trigger verification when alcohol products are present in the order

### Product Classification
- Products must be categorized to identify which items contain alcohol
- System should automatically detect alcohol items in the cart to trigger verification

### Checkout Flow
- Standard checkout process for non-alcohol orders remains unchanged
- For orders containing alcohol: display verification prompt before payment processing
- Successful age verification allows user to proceed to payment
- Failed or declined verification prevents checkout completion and displays appropriate message

## Backend Requirements
- Store product information including alcohol classification
- Track which products require age verification
- Process orders only after successful age verification for alcohol purchases

## Frontend Requirements
- Age verification modal/prompt interface
- Cart analysis to detect alcohol items
- Conditional checkout flow based on cart contents
- Clear messaging for verification requirements and restrictions
