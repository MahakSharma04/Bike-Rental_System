# Bike Rental System API Testing Guide for Postman

## Setup

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection named "Bike Rental System"
3. Set up environment variables:
   - `base_url`: Your API base URL (e.g., `http://localhost:8000/api`)
   - `token`: Will store the authentication token

## Authentication

### 1. Register a User
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body** (JSON):
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone_number": "1234567890",
    "address": "123 Main St",
    "driving_license_number": "DL12345678"
}
```

### 2. Login
- **Method**: POST
- **URL**: `{{base_url}}/auth/login`
- **Body** (JSON):
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```
- **After Success**: Save the returned token to your environment variable named `token`

### 3. Register an Admin User
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body** (JSON):
```json
{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone_number": "0987654321",
    "address": "456 Admin St",
    "driving_license_number": "DL87654321",
    "user_type": "admin"
}
```

## Authorization

For all protected routes, add this to request headers:
- **Key**: `Authorization`
- **Value**: `Bearer {{token}}`

## Bike Management

### 1. Create a Bike (Admin only)
- **Method**: POST
- **URL**: `{{base_url}}/bikes`
- **Auth**: Bearer Token (admin)
- **Body** (JSON):
```json
{
    "model": "Mountain Bike X1",
    "brand": "BikeX",
    "type": "mountain",
    "hourly_rate": 5.99,
    "daily_rate": 29.99,
    "images": ["https://example.com/bike1.jpg"]
}
```

### 2. List All Bikes (Admin only)
- **Method**: GET
- **URL**: `{{base_url}}/bikes`
- **Auth**: Bearer Token (admin)
- **Optional Query Params**:
  - `status`: Filter by status (available, rented, maintenance, damaged)
  - `type`: Filter by bike type
  - `brand`: Filter by brand
  - `min_hourly_rate`: Minimum hourly rate
  - `max_hourly_rate`: Maximum hourly rate
  - `sort_by`: Field to sort by (model, brand, hourly_rate, etc.)
  - `sort_direction`: asc or desc
  - `per_page`: Results per page

### 3. Get Available Bikes
- **Method**: GET
- **URL**: `{{base_url}}/bikes/available`
- **Auth**: Bearer Token
- **Optional Query Params**:
  - `start_date`: Start date (YYYY-MM-DD)
  - `end_date`: End date (YYYY-MM-DD)
  - `type`: Filter by bike type

### 4. Get Bike Types
- **Method**: GET
- **URL**: `{{base_url}}/bikes/types`
- **Auth**: Bearer Token

### 5. View a Specific Bike
- **Method**: GET
- **URL**: `{{base_url}}/bikes/{bike_id}`
- **Auth**: Bearer Token

### 6. Update a Bike (Admin only)
- **Method**: PUT
- **URL**: `{{base_url}}/bikes/{bike_id}`
- **Auth**: Bearer Token (admin)
- **Body** (JSON):
```json
{
    "model": "Updated Bike Model",
    "brand": "Updated Brand",
    "hourly_rate": 7.99,
    "daily_rate": 39.99,
    "status": "available"
}
```

### 7. Upload Bike Images (Admin only)
- **Method**: POST
- **URL**: `{{base_url}}/bikes/{bike_id}/images`
- **Auth**: Bearer Token (admin)
- **Body** (JSON):
```json
{
    "images": [
        "https://example.com/bike_image1.jpg",
        "https://example.com/bike_image2.jpg"
    ]
}
```

### 8. Delete a Bike (Admin only)
- **Method**: DELETE
- **URL**: `{{base_url}}/bikes/{bike_id}`
- **Auth**: Bearer Token (admin)

## Reservation Management

### 1. Create a Reservation
- **Method**: POST
- **URL**: `{{base_url}}/reservations`
- **Auth**: Bearer Token
- **Body** (JSON):
```json
{
    "bike_id": 1,
    "start_datetime": "2023-12-01 10:00:00",
    "end_datetime": "2023-12-01 18:00:00"
}
```

### 2. List All Reservations
- **Method**: GET
- **URL**: `{{base_url}}/reservations`
- **Auth**: Bearer Token (admins see all, users see their own)
- **Optional Query Params**:
  - `status`: Filter by status (pending, confirmed, completed, cancelled, rejected)
  - `start_date`: Filter by start date
  - `end_date`: Filter by end date
  - `bike_id`: Filter by bike
  - `sort_by`: Field to sort by
  - `sort_direction`: asc or desc
  - `per_page`: Results per page

### 3. View a Specific Reservation
- **Method**: GET
- **URL**: `{{base_url}}/reservations/{reservation_id}`
- **Auth**: Bearer Token (admins see all, users see their own)

### 4. Update a Reservation
- **Method**: PUT
- **URL**: `{{base_url}}/reservations/{reservation_id}`
- **Auth**: Bearer Token (admins can update any, users only their pending ones)
- **Body** (JSON):
```json
{
    "start_datetime": "2023-12-01 12:00:00",
    "end_datetime": "2023-12-01 20:00:00"
}
```

### 5. Cancel a Reservation
- **Method**: DELETE
- **URL**: `{{base_url}}/reservations/{reservation_id}`
- **Auth**: Bearer Token (admins can cancel any, users only their pending/confirmed ones)

### 6. Update Reservation Status (Admin only)
- **Method**: PUT
- **URL**: `{{base_url}}/reservations/{reservation_id}/status`
- **Auth**: Bearer Token (admin)
- **Body** (JSON):
```json
{
    "status": "confirmed"
}
```
- **Valid Status Values**: pending, confirmed, completed, cancelled, rejected

## Payment Management

### 1. Get Signed Payment URL
- **Method**: GET
- **URL**: `{{base_url}}/get-payment-link/{reservation_id}`
- **Auth**: Bearer Token
- **Description**: This endpoint returns a signed URL that can be used to access the payment page without authentication. The URL is valid for 30 minutes.

### 2. Access Payment Page (with signed URL)
- **Method**: GET
- **URL**: The URL returned from the previous endpoint
- **Auth**: None needed (uses the signed URL)
- **Description**: This endpoint returns an HTML view with payment form for a specific reservation, including Razorpay integration.

### 3. Process a Razorpay Payment
- **Method**: POST
- **URL**: `{{base_url}}/payments`
- **Auth**: Bearer Token
- **Body** (JSON):
```json
{
    "razorpay_payment_id": "pay_12345abcdef",
    "razorpay_order_id": "order_12345abcdef",
    "razorpay_signature": "signature_string",
    "reservation_id": 1
}
```
- **Description**: This endpoint processes a callback from Razorpay after payment is completed on the client side.

### 4. List All Payments
- **Method**: GET
- **URL**: `{{base_url}}/payments`
- **Auth**: Bearer Token (admins see all, users see their own)
- **Optional Query Params**:
  - `status`: Filter by status (pending, completed, failed, refunded)
  - `payment_method`: Filter by payment method
  - `reservation_id`: Filter by reservation
  - `min_amount`: Minimum payment amount
  - `max_amount`: Maximum payment amount
  - `date_from`: Filter by payment date (start)
  - `date_to`: Filter by payment date (end)
  - `sort_by`: Field to sort by (amount, payment_method, status, payment_date, created_at)
  - `sort_direction`: asc or desc
  - `per_page`: Results per page

### 5. View a Specific Payment
- **Method**: GET
- **URL**: `{{base_url}}/payments/{payment_id}`
- **Auth**: Bearer Token (admins see all, users see their own)

## User Management

### 1. Get Current User Profile
- **Method**: GET
- **URL**: `{{base_url}}/auth/user`
- **Auth**: Bearer Token

### 2. Update User Profile
- **Method**: PUT
- **URL**: `{{base_url}}/auth/user`
- **Auth**: Bearer Token
- **Body** (JSON):
```json
{
    "name": "Updated Name",
    "phone_number": "5555555555",
    "address": "Updated Address"
}
```

### 3. Change Password
- **Method**: POST
- **URL**: `{{base_url}}/auth/change-password`
- **Auth**: Bearer Token
- **Body** (JSON):
```json
{
    "current_password": "password123",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

### 4. Logout
- **Method**: POST
- **URL**: `{{base_url}}/auth/logout`
- **Auth**: Bearer Token

## Testing Flow

1. Register both a regular user and an admin user
2. Login as admin and add several bikes
3. Test bike listing and filtering
4. Login as regular user
5. View available bikes
6. Create a reservation
7. Process a payment for the reservation
8. Test updating the reservation
9. Login as admin
10. Test updating the reservation status
11. View payment details and history
12. Test cancelling reservations and observe bike status changes

## Common HTTP Status Codes

- 200: Success
- 201: Created successfully
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient privileges)
- 404: Resource not found
- 422: Validation error 