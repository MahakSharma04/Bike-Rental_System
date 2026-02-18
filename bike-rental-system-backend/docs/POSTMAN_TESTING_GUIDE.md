# Bike Rental System API - Postman Testing Guide

This document provides testing instructions for all API endpoints in the Bike Rental System, organized by resource type.

## Authentication

Before testing protected endpoints, you need to authenticate:

### Register User
- **Method:** POST
- **Endpoint:** `/api/auth/register`
- **Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone_number": "1234567890",
  "address": "123 Test St",
  "driving_license_number": "DL12345678"
}
```

### Login
- **Method:** POST
- **Endpoint:** `/api/auth/login`
- **Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Response:** Contains token to use in `Authorization: Bearer {token}` header

## Bike Management

### Get All Bikes
- **Method:** GET
- **Endpoint:** `/api/bikes`
- **Query Parameters:**
  - `type` - Filter by bike type
  - `brand` - Filter by brand
  - `min_hourly_rate` - Minimum hourly rate
  - `max_hourly_rate` - Maximum hourly rate
  - `sort_by` - Field to sort by (default: created_at)
  - `sort_direction` - asc or desc (default: desc)
  - `per_page` - Items per page (default: 10)

### Get Bike Details
- **Method:** GET
- **Endpoint:** `/api/bikes/{bike_id}`
- **Auth:** Optional (admins see more details)

### Create Bike (Admin Only)
- **Method:** POST
- **Endpoint:** `/api/bikes`
- **Auth:** Required (admin)
- **Body:**
```json
{
  "model": "Mountain Explorer",
  "brand": "BikeMax",
  "type": "mountain",
  "description": "Premium mountain bike for rough terrain",
  "hourly_rate": 10.50,
  "daily_rate": 45.00,
  "images": [file1, file2]
}
```

### Update Bike (Admin Only)
- **Method:** PUT
- **Endpoint:** `/api/bikes/{bike_id}`
- **Auth:** Required (admin)
- **Body:** Same fields as create, all optional

### Delete Bike (Admin Only)
- **Method:** DELETE
- **Endpoint:** `/api/bikes/{bike_id}`
- **Auth:** Required (admin)

### Get Available Bikes
- **Method:** GET
- **Endpoint:** `/api/bikes/available`
- **Query Parameters:**
  - `start_datetime` - Required, format: "YYYY-MM-DD HH:MM:SS"
  - `end_datetime` - Required, format: "YYYY-MM-DD HH:MM:SS"
  - `type` - Optional bike type filter
  - `brand` - Optional brand filter

### Get Bike Types
- **Method:** GET
- **Endpoint:** `/api/bikes/types`

### Upload Bike Images (Admin Only)
- **Method:** POST
- **Endpoint:** `/api/bikes/{bike_id}/images`
- **Auth:** Required (admin)
- **Body:** Form-data with images[] containing files

## Bike Inventory Management (Admin Only)

### Get All Inventory Items
- **Method:** GET
- **Endpoint:** `/api/bike-inventory`
- **Auth:** Required (admin)
- **Query Parameters:**
  - `bike_id` - Filter by bike model
  - `status` - Filter by status (available, rented, maintenance, damaged)
  - `sort_by` - Field to sort by
  - `sort_direction` - asc or desc
  - `per_page` - Items per page

### Get Inventory Item Details
- **Method:** GET
- **Endpoint:** `/api/bike-inventory/{id}`
- **Auth:** Required (admin)

### Create Inventory Item
- **Method:** POST
- **Endpoint:** `/api/bike-inventory`
- **Auth:** Required (admin)
- **Body:**
```json
{
  "bike_id": 1,
  "plate_number": "BP-1234",
  "serial_number": "BK12345678",
  "status": "available",
  "last_maintenance_date": "2023-05-15"
}
```

### Update Inventory Item
- **Method:** PUT
- **Endpoint:** `/api/bike-inventory/{id}`
- **Auth:** Required (admin)
- **Body:** Same fields as create, all optional

### Delete Inventory Item
- **Method:** DELETE
- **Endpoint:** `/api/bike-inventory/{id}`
- **Auth:** Required (admin)

### Get Available Inventory for Bike
- **Method:** GET
- **Endpoint:** `/api/bikes/{bikeId}/available-inventory`
- **Auth:** Required
- **Query Parameters:**
  - `start_datetime` - Optional, for specific date range availability
  - `end_datetime` - Optional, for specific date range availability

## Reservation Management

### Get All Reservations
- **Method:** GET
- **Endpoint:** `/api/reservations`
- **Auth:** Required (admins see all, users see only their own)
- **Query Parameters:**
  - `status` - Filter by status
  - `start_date` - Filter by start date
  - `end_date` - Filter by end date
  - `bike_id` - Filter by bike model
  - `bike_inventory_id` - Filter by specific inventory item
  - `sort_by` - Field to sort by
  - `sort_direction` - asc or desc
  - `per_page` - Items per page

### Get Reservation Details
- **Method:** GET
- **Endpoint:** `/api/reservations/{reservation}`
- **Auth:** Required (admin or reservation owner)

### Create Reservation
- **Method:** POST
- **Endpoint:** `/api/reservations`
- **Auth:** Required
- **Body:**
```json
{
  "bike_inventory_id": 1,
  "start_datetime": "2023-07-15 10:00:00",
  "end_datetime": "2023-07-15 16:00:00"
}
```

### Update Reservation
- **Method:** PUT
- **Endpoint:** `/api/reservations/{reservation}`
- **Auth:** Required (admin or reservation owner)
- **Body:**
```json
{
  "start_datetime": "2023-07-15 11:00:00",
  "end_datetime": "2023-07-15 17:00:00"
}
```

### Cancel Reservation
- **Method:** DELETE
- **Endpoint:** `/api/reservations/{reservation}`
- **Auth:** Required (admin or reservation owner)

### Update Reservation Status (Admin Only)
- **Method:** PUT
- **Endpoint:** `/api/reservations/{id}/status`
- **Auth:** Required (admin)
- **Body:**
```json
{
  "status": "confirmed" // Options: pending, confirmed, completed, cancelled, rejected
}
```

### Get Reviews by Bike
- **Method:** GET
- **Endpoint:** `/api/reviews/bikes/{bike_id}`
- **Query Parameters:**
  - `rating` - Filter by rating
  - `sort_by` - Field to sort by
  - `sort_direction` - asc or desc
  - `per_page` - Items per page

## Payment Processing

### Create Payment
- **Method:** POST
- **Endpoint:** `/api/payments`
- **Auth:** Not required (can be called anonymously for payment processing)
- **Body:**
```json
{
  "razorpay_payment_id": "pay_123456789",
  "reservation_id": 1,
  "razorpay_order_id": "order_123456789",
  "razorpay_signature": "signature_string"
}
```

### Get All Payments
- **Method:** GET
- **Endpoint:** `/api/payments`
- **Auth:** Required (admins see all, users see only their own)
- **Query Parameters:**
  - `status` - Filter by payment status
  - `payment_method` - Filter by payment method
  - `reservation_id` - Filter by reservation
  - `min_amount` - Minimum payment amount
  - `max_amount` - Maximum payment amount
  - `date_from` - Filter by payment date (start)
  - `date_to` - Filter by payment date (end)
  - `sort_by` - Field to sort by
  - `sort_direction` - asc or desc
  - `per_page` - Items per page

### Get Payment Link
- **Method:** GET
- **Endpoint:** `/api/get-payment-link/{reservationId}`
- **Auth:** Required (admin or reservation owner)

### Get Payment Details
- **Method:** GET
- **Endpoint:** `/api/payments/{id}`
- **Auth:** Required (admin or payment owner)

### Get Razorpay View
- **Method:** GET
- **Endpoint:** `/api/payment-view/{reservationId}`
- **Auth:** Not required (uses signed URL)

### Get Reservation Status (Admin Only)
- **Method:** PUT
- **Endpoint:** `/api/reservations/{reservation}/status`
- **Auth:** Required (admin)
- **Body:**
```json
{
  "status": "confirmed" // Options: pending, confirmed, completed, cancelled, rejected
}
```

## Maintenance Records (Admin Only)

### Get All Maintenance Records
- **Method:** GET
- **Endpoint:** `/api/maintenance`
- **Auth:** Required (admin)

### Get Maintenance Record Details
- **Method:** GET
- **Endpoint:** `/api/maintenance/{id}`
- **Auth:** Required (admin)

### Create Maintenance Record
- **Method:** POST
- **Endpoint:** `/api/maintenance`
- **Auth:** Required (admin)
- **Body:**
```json
{
  "bike_inventory_id": 1,
  "maintenance_type": "routine", // Options: routine, repair
  "description": "Regular check and tune-up",
  "cost": 25.00,
  "scheduled_date": "2023-07-20",
  "status": "scheduled" // Options: scheduled, in-progress, completed
}
```

### Update Maintenance Record
- **Method:** PUT
- **Endpoint:** `/api/maintenance/{id}`
- **Auth:** Required (admin)
- **Body:** Same fields as create, all optional

### Get Scheduled Maintenance
- **Method:** GET
- **Endpoint:** `/api/maintenance/scheduled`
- **Auth:** Required (admin)

### Mark Maintenance as Completed
- **Method:** PUT
- **Endpoint:** `/api/maintenance/{id}/complete`
- **Auth:** Required (admin)

## Damage Reports

### Get All Damage Reports (Admin Only)
- **Method:** GET
- **Endpoint:** `/api/damages`
- **Auth:** Required (admin)
- **Query Parameters:**
  - `status` - Filter by status
  - `severity` - Filter by severity
  - `bike_id` - Filter by bike model
  - `bike_inventory_id` - Filter by inventory item

### Get Damage Report Details
- **Method:** GET
- **Endpoint:** `/api/damages/{id}`
- **Auth:** Required (admin or report owner)

### Create Damage Report
- **Method:** POST
- **Endpoint:** `/api/damages`
- **Auth:** Required
- **Body:**
```json
{
  "reservation_id": 1,
  "bike_inventory_id": 1,
  "description": "Scratched paint on left side",
  "severity": "minor", // Options: minor, moderate, severe
  "images": [file1, file2]
}
```

### Update Damage Report (Admin Only)
- **Method:** PUT
- **Endpoint:** `/api/damages/{id}`
- **Auth:** Required (admin)
- **Body:**
```json
{
  "description": "Updated description",
  "severity": "moderate",
  "status": "under review", // Options: reported, under review, repair scheduled, repaired
  "additional_charges": 25.00
}
```

### Upload Damage Images
- **Method:** POST
- **Endpoint:** `/api/damages/{id}/images`
- **Auth:** Required (admin or report owner)
- **Body:** Form-data with images[] containing files

## Reviews

### Get All Reviews
- **Method:** GET
- **Endpoint:** `/api/reviews`
- **Auth:** Optional
- **Query Parameters:**
  - `rating` - Filter by rating (1-5)
  - `bike_id` - Filter by bike model
  - `bike_inventory_id` - Filter by inventory item
  - `user_id` - Filter by user (admin only)
  - `sort_by` - Field to sort by
  - `sort_direction` - asc or desc
  - `per_page` - Items per page

### Create Review
- **Method:** POST
- **Endpoint:** `/api/reviews`
- **Auth:** Required
- **Body:**
```json
{
  "reservation_id": 1,
  "rating": 5,
  "title": "Great bike!",
  "comment": "This was a fantastic bike for my mountain trail adventure. Would highly recommend."
}
```

### Update Review
- **Method:** PUT
- **Endpoint:** `/api/reviews/{id}`
- **Auth:** Required (admin or review owner)
- **Body:**
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated review comment"
}
```

### Delete Review
- **Method:** DELETE
- **Endpoint:** `/api/reviews/{id}`
- **Auth:** Required (admin or review owner)

## Testing Tips

1. **Authentication First**: Always test auth endpoints first to get a valid token.

2. **Test Admin vs User**: Test endpoints with both admin and regular user accounts to verify access controls.

3. **Testing Sequence**:
   - Create a bike model (admin)
   - Create bike inventory items (admin)
   - Make reservations as a regular user
   - Test payment flows
   - Test maintenance and damage reporting
   - Complete reservations and submit reviews

4. **Error Testing**: Test validation errors by sending invalid or incomplete data.

5. **Status Workflows**: Test the complete lifecycle of reservations, maintenance records, and damage reports through all status changes.

6. **Date-Based Testing**: Test availability with various date ranges to verify the reservation logic.

7. **Image Handling**: Test upload and retrieval of images for bikes and damage reports.

## Environment Setup

Create the following Postman environment variables:

- `base_url`: Your API base URL (e.g., `http://localhost:8000/api`)
- `admin_token`: Authentication token for admin user
- `user_token`: Authentication token for regular user
- `bike_id`: ID of a test bike
- `inventory_id`: ID of a test inventory item
- `reservation_id`: ID of a test reservation

This makes it easier to chain requests and test workflows by using variables like `{{base_url}}` and `{{admin_token}}` in your requests. 