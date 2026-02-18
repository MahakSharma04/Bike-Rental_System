# Payments API Documentation

## Payments

The Payments API provides endpoints to manage reservation payments.

### List Payments

Retrieve a paginated list of payments. Admins see all payments, while regular users see only their own.

- **URL**: `/payments`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `per_page`: Items per page (default: 10)
  - `page`: Page number
  - `sort_by`: Field to sort by (amount, payment_method, status, payment_date, created_at)
  - `sort_direction`: 'asc' or 'desc' (default: 'desc')
  - `status`: Filter by status (pending, completed, failed)
  - `payment_method`: Filter by payment method
  - `reservation_id`: Filter by reservation ID
  - `min_amount`: Filter by minimum amount
  - `max_amount`: Filter by maximum amount
  - `date_from`: Filter by date from (YYYY-MM-DD)
  - `date_to`: Filter by date to (YYYY-MM-DD)
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Payments retrieved successfully",
    "data": {
      "current_page": 1,
      "data": [
        {
          "id": 1,
          "reservation_id": 1,
          "amount": "110.00",
          "payment_method": "razorpay",
          "status": "completed",
          "payment_date": "2023-06-11T12:00:00.000000Z",
          "transaction_id": "pay_MjEbRcStQaZMnN",
          "razor_pay_id": "pay_MjEbRcStQaZMnN",
          "created_at": "2023-06-11T12:00:00.000000Z",
          "updated_at": "2023-06-11T12:00:00.000000Z",
          "reservation": {
            "id": 1,
            "user_id": 2,
            "bike_inventory_id": 3,
            "start_datetime": "2023-06-16T10:00:00.000000Z",
            "end_datetime": "2023-06-18T18:00:00.000000Z",
            "pay_amount": "110.00",
            "status": "confirmed",
            "created_at": "2023-06-10T10:00:00.000000Z",
            "updated_at": "2023-06-11T12:00:00.000000Z"
          }
        },
        // ... more payments
      ],
      // ... pagination information
    }
  }
  ```

### Get Payment Details

Get details of a specific payment.

- **URL**: `/payments/{payment_id}`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Payment details retrieved successfully",
    "data": {
      "id": 1,
      "reservation_id": 1,
      "amount": "110.00",
      "payment_method": "razorpay",
      "status": "completed",
      "payment_date": "2023-06-11T12:00:00.000000Z",
      "transaction_id": "pay_MjEbRcStQaZMnN",
      "razor_pay_id": "pay_MjEbRcStQaZMnN",
      "created_at": "2023-06-11T12:00:00.000000Z",
      "updated_at": "2023-06-11T12:00:00.000000Z",
      "reservation": {
        "id": 1,
        "user_id": 2,
        "bike_inventory_id": 3,
        "start_datetime": "2023-06-16T10:00:00.000000Z",
        "end_datetime": "2023-06-18T18:00:00.000000Z",
        "pay_amount": "110.00",
        "status": "confirmed",
        "created_at": "2023-06-10T10:00:00.000000Z",
        "updated_at": "2023-06-11T12:00:00.000000Z",
        "bike": {
          "id": 1,
          "model": "Mountain Explorer",
          "brand": "Trek",
          "type": "Mountain",
          "description": "Robust mountain bike for rough terrain",
          "hourly_rate": "10.00",
          "daily_rate": "50.00",
          "images": [
            "bikes/bike1_image1.jpg",
            "bikes/bike1_image2.jpg"
          ]
        },
        "user": {
          "id": 2,
          "name": "John Doe",
          "email": "john@example.com",
          "phone_number": "1234567890",
          "address": "123 Main St, City",
          "driving_license_number": "DL1234567890",
          "user_type": "customer"
        }
      }
    }
  }
  ```
- **Note**: Users can only view their own payments, while admins can view any payment.

### Get Payment Link

Generate a temporary signed URL for payment processing.

- **URL**: `/get-payment-link/{reservationId}`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Payment link generated successfully",
    "data": {
      "url": "http://example.com/api/payment-view/1?signature=eyJpdiI6Inh...",
      "expires_in": "30 minutes"
    }
  }
  ```
- **Error Response (422 Unprocessable Entity)**:
  ```json
  {
    "status": false,
    "message": "Payment has already been completed for this reservation"
  }
  ```
- **Note**: Users can only generate payment links for their own reservations. Admins can generate payment links for any reservation. The URL is valid for 30 minutes.

### Process Payment

Process a payment for a reservation.

- **URL**: `/payments`
- **Method**: `POST`
- **Authentication**: None (uses a signed URL)
- **Request Body**:
  ```json
  {
    "razorpay_payment_id": "pay_MjEbRcStQaZMnN",
    "reservation_id": 1,
    "razorpay_order_id": "order_MjEbRcStQaZMnN",
    "razorpay_signature": "b27661f992...",
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Payment successful",
    "payment": {
      "id": 1,
      "reservation_id": 1,
      "amount": "110.00",
      "payment_method": "razorpay",
      "status": "completed",
      "payment_date": "2023-06-11T12:00:00.000000Z",
      "transaction_id": "pay_MjEbRcStQaZMnN",
      "razor_pay_id": "pay_MjEbRcStQaZMnN",
      "created_at": "2023-06-11T12:00:00.000000Z",
      "updated_at": "2023-06-11T12:00:00.000000Z"
    }
  }
  ```
- **Note**: When a payment is successfully processed, the corresponding reservation status is automatically updated to "confirmed".

### Payment View

The payment view endpoint renders the HTML payment page.

- **URL**: `/payment-view/{reservationId}`
- **Method**: `GET`
- **Authentication**: None (uses a signed URL)
- **Note**: This endpoint is accessed through the signed URL from the "Get Payment Link" endpoint. It renders an HTML page with the Razorpay payment form. 