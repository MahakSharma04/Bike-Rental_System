# Reservations API Documentation

## Reservations

The Reservations API provides endpoints to manage bike reservations.

### List Reservations

Retrieve a paginated list of reservations. Admins see all reservations, while regular users see only their own.

- **URL**: `/reservations`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `per_page`: Items per page (default: 10)
  - `page`: Page number
  - `sort_by`: Field to sort by (start_datetime, end_datetime, status, created_at)
  - `sort_direction`: 'asc' or 'desc' (default: 'desc')
  - `status`: Filter by status (pending, confirmed, completed, cancelled, rejected)
  - `start_date`: Filter by start date (YYYY-MM-DD)
  - `end_date`: Filter by end date (YYYY-MM-DD)
  - `bike_id`: Filter by bike ID
  - `bike_inventory_id`: Filter by bike inventory ID
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Reservations retrieved successfully",
    "data": {
      "current_page": 1,
      "data": [
        {
          "id": 1,
          "user_id": 2,
          "bike_inventory_id": 3,
          "start_datetime": "2023-06-15T10:00:00.000000Z",
          "end_datetime": "2023-06-17T18:00:00.000000Z",
          "pay_amount": "110.00",
          "status": "confirmed",
          "created_at": "2023-06-10T10:00:00.000000Z",
          "updated_at": "2023-06-11T10:00:00.000000Z",
          "bikeInventory": {
            "id": 3,
            "bike_id": 1,
            "plate_number": "MTB-123",
            "serial_number": "TK12345678",
            "status": "rented",
            "last_maintenance_date": "2023-04-15",
            "created_at": "2023-04-01T10:00:00.000000Z",
            "updated_at": "2023-06-11T10:00:00.000000Z",
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
              ],
              "created_at": "2023-04-01T10:00:00.000000Z",
              "updated_at": "2023-04-01T10:00:00.000000Z"
            }
          }
        },
        // ... more reservations
      ],
      // ... pagination information
    }
  }
  ```

### Create Reservation

Create a new bike reservation.

- **URL**: `/reservations`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "bike_inventory_id": 3,
    "start_datetime": "2023-06-15 10:00:00",
    "end_datetime": "2023-06-17 18:00:00"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": true,
    "message": "Reservation created successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_inventory_id": 3,
      "start_datetime": "2023-06-15T10:00:00.000000Z",
      "end_datetime": "2023-06-17T18:00:00.000000Z",
      "pay_amount": "110.00",
      "status": "pending",
      "created_at": "2023-06-10T10:00:00.000000Z",
      "updated_at": "2023-06-10T10:00:00.000000Z",
      "bikeInventory": {
        "id": 3,
        "bike_id": 1,
        "plate_number": "MTB-123",
        "serial_number": "TK12345678",
        "status": "available",
        "last_maintenance_date": "2023-04-15",
        "created_at": "2023-04-01T10:00:00.000000Z",
        "updated_at": "2023-04-01T10:00:00.000000Z",
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
          ],
          "created_at": "2023-04-01T10:00:00.000000Z",
          "updated_at": "2023-04-01T10:00:00.000000Z"
        }
      }
    }
  }
  ```
- **Note**: The system automatically calculates the payment amount based on hourly or daily rates.
- **Validation Rules**:
  - `bike_inventory_id`: Required, must exist in bike_inventories table
  - `start_datetime`: Required, must be a valid date/time format, must be in the future
  - `end_datetime`: Required, must be a valid date/time format, must be after start_datetime

### Get Reservation Details

Get details of a specific reservation.

- **URL**: `/reservations/{reservation_id}`
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
    "message": "Reservation details retrieved successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_inventory_id": 3,
      "start_datetime": "2023-06-15T10:00:00.000000Z",
      "end_datetime": "2023-06-17T18:00:00.000000Z",
      "pay_amount": "110.00",
      "status": "pending",
      "created_at": "2023-06-10T10:00:00.000000Z",
      "updated_at": "2023-06-10T10:00:00.000000Z",
      "bikeInventory": {
        "id": 3,
        "bike_id": 1,
        "plate_number": "MTB-123",
        "serial_number": "TK12345678",
        "status": "available",
        "last_maintenance_date": "2023-04-15",
        "created_at": "2023-04-01T10:00:00.000000Z",
        "updated_at": "2023-04-01T10:00:00.000000Z",
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
          ],
          "created_at": "2023-04-01T10:00:00.000000Z",
          "updated_at": "2023-04-01T10:00:00.000000Z"
        }
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
  ```
- **Note**: Users can only view their own reservations, while admins can view any reservation.

### Update Reservation

Update details of a pending reservation.

- **URL**: `/reservations/{reservation_id}`
- **Method**: `PUT`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "start_datetime": "2023-06-16 10:00:00",
    "end_datetime": "2023-06-18 18:00:00"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Reservation updated successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_inventory_id": 3,
      "start_datetime": "2023-06-16T10:00:00.000000Z",
      "end_datetime": "2023-06-18T18:00:00.000000Z",
      "pay_amount": "110.00",
      "status": "pending",
      "created_at": "2023-06-10T10:00:00.000000Z",
      "updated_at": "2023-06-11T10:00:00.000000Z",
      "bikeInventory": {
        "id": 3,
        "bike_id": 1,
        "plate_number": "MTB-123",
        "serial_number": "TK12345678",
        "status": "available",
        "last_maintenance_date": "2023-04-15",
        "created_at": "2023-04-01T10:00:00.000000Z",
        "updated_at": "2023-04-01T10:00:00.000000Z",
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
          ],
          "created_at": "2023-04-01T10:00:00.000000Z",
          "updated_at": "2023-04-01T10:00:00.000000Z"
        }
      }
    }
  }
  ```
- **Note**: Users can only update their own pending reservations. Admins can update any reservation at any status. The system recalculates the payment amount if dates change.

### Cancel Reservation

Cancel a pending or confirmed reservation.

- **URL**: `/reservations/{reservation_id}`
- **Method**: `DELETE`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Reservation cancelled successfully"
  }
  ```
- **Error Response (422 Unprocessable Entity)**:
  ```json
  {
    "status": false,
    "message": "Cannot cancel. Reservation is already completed"
  }
  ```
- **Note**: Users can only cancel their own reservations. Admins can cancel any reservation. Only pending or confirmed reservations can be cancelled.

### Update Reservation Status

Update the status of a reservation (Admin only).

- **URL**: `/reservations/{reservation_id}/status`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "status": "confirmed"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Reservation status updated successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_inventory_id": 3,
      "start_datetime": "2023-06-16T10:00:00.000000Z",
      "end_datetime": "2023-06-18T18:00:00.000000Z",
      "pay_amount": "110.00",
      "status": "confirmed",
      "created_at": "2023-06-10T10:00:00.000000Z",
      "updated_at": "2023-06-11T11:00:00.000000Z"
    }
  }
  ```
- **Validation Rules**:
  - `status`: Required, one of: pending, confirmed, completed, cancelled, rejected
- **Note**: When a reservation is confirmed, the bike inventory status is updated to "rented". When a reservation is completed, cancelled, or rejected, the bike inventory status is updated to "available". 