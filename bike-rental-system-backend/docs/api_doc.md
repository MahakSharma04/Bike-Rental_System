# Bike Rental System API Documentation

This document provides a comprehensive guide to the Bike Rental System API endpoints for frontend integration.

## Table of Contents
1. [Authentication](#authentication)
2. [Bikes](#bikes)
3. [Bike Inventory](#bike-inventory)
4. [Reservations](#reservations)
5. [Payments](#payments)
6. [Maintenance](#maintenance)
7. [Damage Reports](#damage-reports)
8. [Reviews](#reviews)

## Base URL

All API endpoints are relative to: `/api`

## Response Format

All API responses follow this standard JSON format:

```json
{
  "status": true,  // boolean indicating success (true) or failure (false)
  "message": "Success message or error description",
  "data": {}, // The actual response data (can be an object, array, or null)
  "errors": {} // Only included when validation errors occur
}
```

## Authentication

Authentication uses Laravel Sanctum (token-based authentication).

### Register

Creates a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone_number": "1234567890",
    "address": "123 Main St, City",
    "driving_license_number": "DL1234567890"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": "1234567890",
        "address": "123 Main St, City",
        "driving_license_number": "DL1234567890",
        "user_type": "customer"
      },
      "access_token": "1|EywdqVpb6fSxv3LQ2i5vZDINdKvZVXS0iU2YM8UA",
      "token_type": "Bearer"
    }
  }
  ```
- **Validation Rules**:
  - `name`: Required, string, max 255 chars
  - `email`: Required, valid email, unique in users table
  - `password`: Required, min 8 chars, must match password_confirmation
  - `phone_number`: Required, string, max 15 chars
  - `address`: Optional, string
  - `driving_license_number`: Required, string, max 50 chars

### Login

Log in to an existing account.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "User logged in successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": "1234567890",
        "address": "123 Main St, City",
        "driving_license_number": "DL1234567890",
        "user_type": "customer"
      },
      "access_token": "1|EywdqVpb6fSxv3LQ2i5vZDINdKvZVXS0iU2YM8UA",
      "token_type": "Bearer"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "status": false,
    "message": "Invalid login credentials"
  }
  ```

### Logout

Invalidate the current user's authentication token.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "User logged out successfully"
  }
  ```

### Get User Details

Get the current user's profile information.

- **URL**: `/auth/user`
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
    "message": "User details retrieved successfully",
    "data": {
      "user": {
        "id": 1,
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

### Update User Profile

Update the current user's profile information.

- **URL**: `/auth/user`
- **Method**: `PUT`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "phone_number": "9876543210",
    "address": "456 New St, Town",
    "driving_license_number": "DL9876543210"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "User profile updated successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "John Updated",
        "email": "john@example.com",
        "phone_number": "9876543210",
        "address": "456 New St, Town",
        "driving_license_number": "DL9876543210",
        "user_type": "customer"
      }
    }
  }
  ```
- **Validation Rules**:
  - `name`: Optional, string, max 255 chars
  - `phone_number`: Optional, string, max 15 chars
  - `address`: Optional, string
  - `driving_license_number`: Optional, string, max 50 chars

### Change Password

Update the current user's password.

- **URL**: `/auth/change-password`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "current_password": "password123",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Password changed successfully"
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "status": false,
    "message": "Current password is incorrect"
  }
  ```
- **Validation Rules**:
  - `current_password`: Required, string
  - `password`: Required, string, min 8 chars, must match password_confirmation

## Bikes

The Bikes API provides endpoints to manage and search for bike models.

### List All Bikes

Retrieve a paginated list of all bike models (Admin only).

- **URL**: `/bikes`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `per_page`: Items per page (default: 10)
  - `page`: Page number
  - `sort_by`: Field to sort by (model, brand, type, hourly_rate, daily_rate, created_at)
  - `sort_direction`: 'asc' or 'desc' (default: 'desc')
  - `type`: Filter by bike type
  - `brand`: Filter by bike brand
  - `min_hourly_rate`: Filter by minimum hourly rate
  - `max_hourly_rate`: Filter by maximum hourly rate
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bikes retrieved successfully",
    "data": {
      "current_page": 1,
      "data": [
        {
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
          "created_at": "2023-05-15T10:00:00.000000Z",
          "updated_at": "2023-05-15T10:00:00.000000Z"
        },
        // ... more bike models
      ],
      "first_page_url": "http://example.com/api/bikes?page=1",
      "from": 1,
      "last_page": 3,
      "last_page_url": "http://example.com/api/bikes?page=3",
      "links": [
        {"url": null, "label": "&laquo; Previous", "active": false},
        {"url": "http://example.com/api/bikes?page=1", "label": "1", "active": true},
        {"url": "http://example.com/api/bikes?page=2", "label": "2", "active": false},
        {"url": "http://example.com/api/bikes?page=3", "label": "3", "active": false},
        {"url": "http://example.com/api/bikes?page=2", "label": "Next &raquo;", "active": false}
      ],
      "next_page_url": "http://example.com/api/bikes?page=2",
      "path": "http://example.com/api/bikes",
      "per_page": 10,
      "prev_page_url": null,
      "to": 10,
      "total": 25
    }
  }
  ```

### Get Available Bikes

Retrieve a list of bikes available for rent during a specific time period.

- **URL**: `/bikes/available`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters (Required)**:
  - `start_datetime`: Start date and time (format: YYYY-MM-DD HH:MM:SS)
  - `end_datetime`: End date and time (format: YYYY-MM-DD HH:MM:SS)
- **Query Parameters (Optional)**:
  - `type`: Filter by bike type
  - `brand`: Filter by bike brand
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Available bikes retrieved successfully",
    "data": [
      {
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
        "available_inventory": [
          {
            "id": 3,
            "bike_id": 1,
            "plate_number": "MTB-123",
            "serial_number": "TK12345678",
            "status": "available",
            "last_maintenance_date": "2023-04-15",
            "created_at": "2023-04-01T10:00:00.000000Z",
            "updated_at": "2023-04-15T10:00:00.000000Z"
          },
          // ... more available inventory items
        ],
        "available_count": 3
      },
      // ... more available bike models
    ]
  }
  ```

### Get Bike Types

Get a list of all unique bike types.

- **URL**: `/bikes/types`
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
    "message": "Bike types retrieved successfully",
    "data": [
      "Mountain",
      "Road",
      "Hybrid",
      "City",
      "Electric"
    ]
  }
  ```

### Get Bike Details

Get detailed information about a specific bike model.

- **URL**: `/bikes/{bike_id}`
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
    "message": "Bike details retrieved successfully",
    "data": {
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
      "created_at": "2023-05-15T10:00:00.000000Z",
      "updated_at": "2023-05-15T10:00:00.000000Z",
      "inventoryItems": [
        {
          "id": 3,
          "bike_id": 1,
          "plate_number": "MTB-123",
          "serial_number": "TK12345678",
          "status": "available",
          "last_maintenance_date": "2023-04-15",
          "created_at": "2023-04-01T10:00:00.000000Z",
          "updated_at": "2023-04-15T10:00:00.000000Z"
        }
        // ... more inventory items (admin only)
      ]
    }
  }
  ```
- **Note**: For admin users, the response includes all inventory items. For regular users, it only includes available inventory items.

### Create Bike

Create a new bike model (Admin only).

- **URL**: `/bikes`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  ```
- **Request Body**:
  ```
  model: Mountain Explorer
  brand: Trek
  type: Mountain
  description: Robust mountain bike for rough terrain
  hourly_rate: 10.00
  daily_rate: 50.00
  images[]: [file1]
  images[]: [file2]
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": true,
    "message": "Bike created successfully",
    "data": {
      "id": 1,
      "model": "Mountain Explorer",
      "brand": "Trek",
      "type": "Mountain",
      "description": "Robust mountain bike for rough terrain",
      "hourly_rate": "10.00",
      "daily_rate": "50.00",
      "images": [
        "bikes/aBcDeF123456.jpg",
        "bikes/gHiJkL789012.jpg"
      ],
      "created_at": "2023-05-15T10:00:00.000000Z",
      "updated_at": "2023-05-15T10:00:00.000000Z"
    }
  }
  ```
- **Validation Rules**:
  - `model`: Required, string, max 255 chars
  - `brand`: Required, string, max 255 chars
  - `type`: Required, string, max 255 chars
  - `description`: Optional, string
  - `hourly_rate`: Required, numeric, min 0
  - `daily_rate`: Required, numeric, min 0
  - `images`: Optional, array of image files (jpeg, png, jpg, max 2MB each)

### Update Bike

Update an existing bike model (Admin only).

- **URL**: `/bikes/{bike_id}`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  ```
- **Request Body**:
  ```
  model: Mountain Explorer Pro
  brand: Trek
  type: Mountain
  description: Updated description
  hourly_rate: 12.00
  daily_rate: 60.00
  images[]: [file1]
  images[]: [file2]
  replace_images: true
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike updated successfully",
    "data": {
      "id": 1,
      "model": "Mountain Explorer Pro",
      "brand": "Trek",
      "type": "Mountain",
      "description": "Updated description",
      "hourly_rate": "12.00",
      "daily_rate": "60.00",
      "images": [
        "bikes/new_image1.jpg",
        "bikes/new_image2.jpg"
      ],
      "created_at": "2023-05-15T10:00:00.000000Z",
      "updated_at": "2023-05-16T10:00:00.000000Z"
    }
  }
  ```
- **Note**: If `replace_images` is true, all existing images will be replaced. If false or not provided, new images will be appended to existing ones.

### Delete Bike

Delete a bike model (Admin only).

- **URL**: `/bikes/{bike_id}`
- **Method**: `DELETE`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike deleted successfully"
  }
  ```
- **Error Response (422 Unprocessable Entity)**:
  ```json
  {
    "status": false,
    "message": "Cannot delete bike with active reservations"
  }
  ```

### Upload Bike Images

Upload additional images to an existing bike model (Admin only).

- **URL**: `/bikes/{bike_id}/images`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  ```
- **Request Body**:
  ```
  images[]: [file1]
  images[]: [file2]
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike images uploaded successfully",
    "data": {
      "images": [
        "bikes/existing_image1.jpg",
        "bikes/existing_image2.jpg",
        "bikes/new_image1.jpg",
        "bikes/new_image2.jpg"
      ]
    }
  }
  ```
- **Validation Rules**:
  - `images`: Required, array of image files (jpeg, png, jpg, max 2MB each)

## Bike Inventory

The Bike Inventory API provides endpoints to manage physical bike instances for each bike model.

### List Bike Inventory

Retrieve a paginated list of all bike inventory items (Admin only).

- **URL**: `/bike-inventory`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `per_page`: Items per page (default: 15)
  - `page`: Page number
  - `sort_by`: Field to sort by (id, plate_number, status, last_maintenance_date, created_at)
  - `sort_direction`: 'asc' or 'desc' (default: 'asc')
  - `status`: Filter by status (available, rented, maintenance, damaged)
  - `bike_id`: Filter by bike model ID
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike inventory items retrieved successfully",
    "data": {
      "current_page": 1,
      "data": [
        {
          "id": 1,
          "bike_id": 1,
          "plate_number": "MTB-001",
          "serial_number": "TK1234567",
          "status": "available",
          "last_maintenance_date": "2023-04-15",
          "created_at": "2023-04-01T10:00:00.000000Z",
          "updated_at": "2023-04-15T10:00:00.000000Z",
          "bike": {
            "id": 1,
            "model": "Mountain Explorer",
            "brand": "Trek",
            "type": "Mountain",
            "description": "Robust mountain bike for rough terrain",
            "hourly_rate": "10.00",
            "daily_rate": "50.00",
            "created_at": "2023-04-01T10:00:00.000000Z",
            "updated_at": "2023-04-01T10:00:00.000000Z"
          }
        },
        // ... more inventory items
      ],
      "first_page_url": "http://example.com/api/bike-inventory?page=1",
      "from": 1,
      "last_page": 3,
      "last_page_url": "http://example.com/api/bike-inventory?page=3",
      "links": [
        // ... pagination links
      ],
      "next_page_url": "http://example.com/api/bike-inventory?page=2",
      "path": "http://example.com/api/bike-inventory",
      "per_page": 15,
      "prev_page_url": null,
      "to": 15,
      "total": 40
    }
  }
  ```

### Get Bike Inventory Item

Get details of a specific bike inventory item (Admin only).

- **URL**: `/bike-inventory/{id}`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike inventory item retrieved successfully",
    "data": {
      "id": 1,
      "bike_id": 1,
      "plate_number": "MTB-001",
      "serial_number": "TK1234567",
      "status": "available",
      "last_maintenance_date": "2023-04-15",
      "created_at": "2023-04-01T10:00:00.000000Z",
      "updated_at": "2023-04-15T10:00:00.000000Z",
      "bike": {
        "id": 1,
        "model": "Mountain Explorer",
        "brand": "Trek",
        "type": "Mountain",
        "description": "Robust mountain bike for rough terrain",
        "hourly_rate": "10.00",
        "daily_rate": "50.00",
        "created_at": "2023-04-01T10:00:00.000000Z",
        "updated_at": "2023-04-01T10:00:00.000000Z"
      }
    }
  }
  ```

### Create Bike Inventory Item

Add a new physical bike instance to inventory (Admin only).

- **URL**: `/bike-inventory`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "bike_id": 1,
    "plate_number": "MTB-002",
    "serial_number": "TK7654321",
    "status": "available",
    "last_maintenance_date": "2023-05-01"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": true,
    "message": "Bike inventory item created successfully",
    "data": {
      "id": 2,
      "bike_id": 1,
      "plate_number": "MTB-002",
      "serial_number": "TK7654321",
      "status": "available",
      "last_maintenance_date": "2023-05-01",
      "created_at": "2023-05-10T10:00:00.000000Z",
      "updated_at": "2023-05-10T10:00:00.000000Z",
      "bike": {
        "id": 1,
        "model": "Mountain Explorer",
        "brand": "Trek",
        "type": "Mountain",
        "description": "Robust mountain bike for rough terrain",
        "hourly_rate": "10.00",
        "daily_rate": "50.00",
        "created_at": "2023-04-01T10:00:00.000000Z",
        "updated_at": "2023-04-01T10:00:00.000000Z"
      }
    }
  }
  ```
- **Validation Rules**:
  - `bike_id`: Required, must exist in bikes table
  - `plate_number`: Required, string, max 50 chars, must be unique
  - `serial_number`: Required, string, max 100 chars, must be unique
  - `status`: Required, one of: available, rented, maintenance, damaged
  - `last_maintenance_date`: Optional, date

### Update Bike Inventory Item

Update a bike inventory item (Admin only).

- **URL**: `/bike-inventory/{id}`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "bike_id": 1,
    "plate_number": "MTB-002-UPDATED",
    "serial_number": "TK7654321",
    "status": "maintenance",
    "last_maintenance_date": "2023-05-15"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike inventory item updated successfully",
    "data": {
      "id": 2,
      "bike_id": 1,
      "plate_number": "MTB-002-UPDATED",
      "serial_number": "TK7654321",
      "status": "maintenance",
      "last_maintenance_date": "2023-05-15",
      "created_at": "2023-05-10T10:00:00.000000Z",
      "updated_at": "2023-05-15T10:00:00.000000Z",
      "bike": {
        "id": 1,
        "model": "Mountain Explorer",
        "brand": "Trek",
        "type": "Mountain",
        "description": "Robust mountain bike for rough terrain",
        "hourly_rate": "10.00",
        "daily_rate": "50.00",
        "created_at": "2023-04-01T10:00:00.000000Z",
        "updated_at": "2023-04-01T10:00:00.000000Z"
      }
    }
  }
  ```

### Delete Bike Inventory Item

Remove a bike inventory item (Admin only).

- **URL**: `/bike-inventory/{id}`
- **Method**: `DELETE`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike inventory item deleted successfully"
  }
  ```
- **Error Response (422 Unprocessable Entity)**:
  ```json
  {
    "status": false,
    "message": "Cannot delete bike inventory item with existing reservations"
  }
  ```

### Get Available Inventory by Bike

Get available inventory items for a specific bike model.

- **URL**: `/bikes/{bikeId}/available-inventory`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters (Optional)**:
  - `start_date`: Filter by availability from this date (YYYY-MM-DD)
  - `end_date`: Filter by availability until this date (YYYY-MM-DD)
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Available bike inventory items retrieved successfully",
    "data": {
      "bike": {
        "id": 1,
        "model": "Mountain Explorer",
        "brand": "Trek",
        "type": "Mountain",
        "description": "Robust mountain bike for rough terrain",
        "hourly_rate": "10.00",
        "daily_rate": "50.00"
      },
      "available_items": [
        {
          "id": 1,
          "bike_id": 1,
          "plate_number": "MTB-001",
          "serial_number": "TK1234567",
          "status": "available",
          "last_maintenance_date": "2023-04-15",
          "created_at": "2023-04-01T10:00:00.000000Z",
          "updated_at": "2023-04-15T10:00:00.000000Z"
        },
        // ... more available items
      ]
    }
  }
  ```

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

## Maintenance

The Maintenance API provides endpoints to manage bike maintenance records (Admin only).

### List Maintenance Records

Retrieve a list of all maintenance records.

- **URL**: `/maintenance`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "bike_inventory_id": 3,
        "maintenance_type": "routine",
        "description": "Regular checkup and tire pressure adjustment",
        "cost": "25.00",
        "scheduled_date": "2023-07-15",
        "completion_date": null,
        "status": "scheduled",
        "created_at": "2023-06-20T10:00:00.000000Z",
        "updated_at": "2023-06-20T10:00:00.000000Z",
        "bikeInventory": {
          "id": 3,
          "bike_id": 1,
          "plate_number": "MTB-123",
          "serial_number": "TK12345678",
          "status": "available",
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
            ]
          }
        }
      }
    ]
  }
  ```

### Get Scheduled Maintenance

Retrieve a list of upcoming scheduled maintenance records.

- **URL**: `/maintenance/scheduled`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "bike_inventory_id": 3,
        "maintenance_type": "routine",
        "description": "Regular checkup and tire pressure adjustment",
        "cost": "25.00",
        "scheduled_date": "2023-07-15",
        "completion_date": null,
        "status": "scheduled",
        "created_at": "2023-06-20T10:00:00.000000Z",
        "updated_at": "2023-06-20T10:00:00.000000Z",
        "bikeInventory": {
          "id": 3,
          "bike_id": 1,
          "plate_number": "MTB-123",
          "serial_number": "TK12345678",
          "status": "available",
          "last_maintenance_date": "2023-04-15"
        }
      }
    ]
  }
  ```

### Get Maintenance Record

Get details of a specific maintenance record.

- **URL**: `/maintenance/{id}`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "bike_inventory_id": 3,
      "maintenance_type": "routine",
      "description": "Regular checkup and tire pressure adjustment",
      "cost": "25.00",
      "scheduled_date": "2023-07-15",
      "completion_date": null,
      "status": "scheduled",
      "created_at": "2023-06-20T10:00:00.000000Z",
      "updated_at": "2023-06-20T10:00:00.000000Z",
      "bikeInventory": {
        "id": 3,
        "bike_id": 1,
        "plate_number": "MTB-123",
        "serial_number": "TK12345678",
        "status": "available",
        "last_maintenance_date": "2023-04-15",
        "bike": {
          "id": 1,
          "model": "Mountain Explorer",
          "brand": "Trek",
          "type": "Mountain",
          "description": "Robust mountain bike for rough terrain"
        }
      }
    }
  }
  ```

### Create Maintenance Record

Create a new maintenance record.

- **URL**: `/maintenance`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "bike_inventory_id": 3,
    "maintenance_type": "routine",
    "description": "Regular checkup and tire pressure adjustment",
    "cost": 25.00,
    "scheduled_date": "2023-07-15",
    "status": "scheduled"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Maintenance record created successfully",
    "data": {
      "id": 1,
      "bike_inventory_id": 3,
      "maintenance_type": "routine",
      "description": "Regular checkup and tire pressure adjustment",
      "cost": "25.00",
      "scheduled_date": "2023-07-15",
      "completion_date": null,
      "status": "scheduled",
      "created_at": "2023-06-20T10:00:00.000000Z",
      "updated_at": "2023-06-20T10:00:00.000000Z",
      "bikeInventory": {
        "id": 3,
        "bike_id": 1,
        "plate_number": "MTB-123",
        "serial_number": "TK12345678",
        "status": "available",
        "last_maintenance_date": "2023-04-15"
      }
    }
  }
  ```
- **Validation Rules**:
  - `bike_inventory_id`: Required, must exist in bike_inventories table
  - `maintenance_type`: Required, one of: routine, repair
  - `description`: Required, string
  - `cost`: Optional, numeric, min 0
  - `scheduled_date`: Required, date
  - `status`: Optional, one of: scheduled, in-progress, completed

### Update Maintenance Record

Update an existing maintenance record.

- **URL**: `/maintenance/{id}`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "bike_inventory_id": 3,
    "maintenance_type": "repair",
    "description": "Chain replacement",
    "cost": 45.00,
    "scheduled_date": "2023-07-15",
    "status": "in-progress"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Maintenance record updated successfully",
    "data": {
      "id": 1,
      "bike_inventory_id": 3,
      "maintenance_type": "repair",
      "description": "Chain replacement",
      "cost": "45.00",
      "scheduled_date": "2023-07-15",
      "status": "in-progress"
    }
  }
  ```

### Complete Maintenance

Mark a maintenance record as completed.

- **URL**: `/maintenance/{id}/complete`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Maintenance completed successfully",
    "data": {
      "id": 1,
      "bike_inventory_id": 3,
      "maintenance_type": "repair",
      "description": "Chain replacement",
      "cost": "45.00",
      "scheduled_date": "2023-07-15",
      "completion_date": "2023-07-15T14:30:00.000000Z",
      "status": "completed"
    }
  }
  ```
- **Note**: When a maintenance record is completed, the bike inventory status is automatically updated to "available" and the last_maintenance_date is updated.

## Damage Reports

The Damage Reports API provides endpoints to manage bike damage reports submitted by users or admins.

### List Damage Reports

Retrieve a list of all damage reports (Admin only).

- **URL**: `/damages`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `status`: Filter by status (reported, under review, repair scheduled, repaired)
  - `severity`: Filter by severity (minor, moderate, severe)
  - `bike_id`: Filter by bike ID
  - `bike_inventory_id`: Filter by bike inventory ID
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "reservation_id": 1,
        "bike_inventory_id": 3,
        "reported_by": 2,
        "description": "Scratches on the frame and damaged brake",
        "severity": "moderate",
        "status": "under review",
        "additional_charges": "20.00",
        "images": [
          "damage-reports/image1.jpg",
          "damage-reports/image2.jpg"
        ],
        "created_at": "2023-06-18T15:00:00.000000Z",
        "updated_at": "2023-06-19T10:00:00.000000Z",
        "bikeInventory": {
          "id": 3,
          "bike_id": 1,
          "plate_number": "MTB-123",
          "serial_number": "TK12345678",
          "status": "damaged"
        },
        "reservation": {
          "id": 1,
          "user_id": 2,
          "status": "completed"
        },
        "reporter": {
          "id": 2,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  }
  ```

### Get Damage Report

Get details of a specific damage report.

- **URL**: `/damages/{id}`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "reservation_id": 1,
      "bike_inventory_id": 3,
      "reported_by": 2,
      "description": "Scratches on the frame and damaged brake",
      "severity": "moderate",
      "status": "under review",
      "additional_charges": "20.00",
      "images": [
        "damage-reports/image1.jpg",
        "damage-reports/image2.jpg"
      ],
      "created_at": "2023-06-18T15:00:00.000000Z",
      "updated_at": "2023-06-19T10:00:00.000000Z",
      "bikeInventory": {
        "id": 3,
        "bike_id": 1,
        "plate_number": "MTB-123",
        "serial_number": "TK12345678",
        "status": "damaged",
        "bike": {
          "id": 1,
          "model": "Mountain Explorer",
          "brand": "Trek",
          "type": "Mountain"
        }
      },
      "reservation": {
        "id": 1,
        "user_id": 2,
        "bike_inventory_id": 3,
        "status": "completed"
      },
      "reporter": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```
- **Note**: Users can only access their own damage reports, while admins can access any damage report.

### Create Damage Report

Submit a new damage report.

- **URL**: `/damages`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  ```
- **Request Body**:
  ```
  reservation_id: 1
  bike_inventory_id: 3
  description: Scratches on the frame and damaged brake
  severity: moderate
  images[]: [file1]
  images[]: [file2]
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Damage report submitted successfully",
    "data": {
      "id": 1,
      "reservation_id": 1,
      "bike_inventory_id": 3,
      "reported_by": 2,
      "description": "Scratches on the frame and damaged brake",
      "severity": "moderate",
      "status": "reported",
      "additional_charges": "0.00",
      "images": [
        "damage-reports/image1.jpg",
        "damage-reports/image2.jpg"
      ],
      "created_at": "2023-06-18T15:00:00.000000Z",
      "updated_at": "2023-06-18T15:00:00.000000Z"
    }
  }
  ```
- **Validation Rules**:
  - `reservation_id`: Required, must exist in reservations table
  - `bike_inventory_id`: Required, must exist in bike_inventories table and match the reservation's bike
  - `description`: Required, string
  - `severity`: Required, one of: minor, moderate, severe
  - `images`: Optional, array of image files (jpeg, png, jpg, max 2MB each)
- **Note**: Users can only submit damage reports for their own reservations. If damage severity is moderate or severe, the bike inventory status is automatically updated to "damaged".

### Update Damage Report

Update a damage report (Admin only).

- **URL**: `/damages/{id}`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "description": "Scratches on the frame and damaged brake lever",
    "severity": "moderate",
    "status": "repair scheduled",
    "additional_charges": 25.00
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Damage report updated successfully",
    "data": {
      "id": 1,
      "reservation_id": 1,
      "bike_inventory_id": 3,
      "reported_by": 2,
      "description": "Scratches on the frame and damaged brake lever",
      "severity": "moderate",
      "status": "repair scheduled",
      "additional_charges": "25.00",
      "images": [
        "damage-reports/image1.jpg",
        "damage-reports/image2.jpg"
      ],
      "created_at": "2023-06-18T15:00:00.000000Z",
      "updated_at": "2023-06-19T14:00:00.000000Z"
    }
  }
  ```
- **Validation Rules**:
  - `description`: Optional, string
  - `severity`: Optional, one of: minor, moderate, severe
  - `status`: Optional, one of: reported, under review, repair scheduled, repaired
  - `additional_charges`: Optional, numeric, min 0

### Upload Damage Report Images

Upload images for a damage report.

- **URL**: `/damages/{id}/images`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  ```
- **Request Body**:
  ```
  images[]: [file1]
  images[]: [file2]
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Images uploaded successfully",
    "data": {
      "images": [
        "damage-reports/image1.jpg",
        "damage-reports/image2.jpg",
        "damage-reports/new_image1.jpg",
        "damage-reports/new_image2.jpg"
      ]
    }
  }
  ```
- **Validation Rules**:
  - `images`: Required, array of image files (jpeg, png, jpg, max 2MB each)
- **Note**: Users can only upload images for their own damage reports, while admins can upload images for any damage report.

## Reviews

The Reviews API provides endpoints to manage bike reviews submitted by users.

### List Reviews

Retrieve a paginated list of all reviews.

- **URL**: `/reviews`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `per_page`: Items per page (default: 10)
  - `page`: Page number
  - `sort_by`: Field to sort by (rating, created_at)
  - `sort_direction`: 'asc' or 'desc' (default: 'desc')
  - `rating`: Filter by rating (1-5)
  - `bike_id`: Filter by bike ID
  - `bike_inventory_id`: Filter by bike inventory ID
  - `user_id`: Filter by user ID (admin only)
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Reviews retrieved successfully",
    "data": {
      "current_page": 1,
      "data": [
        {
          "id": 1,
          "user_id": 2,
          "bike_id": 1,
          "bike_inventory_id": 3,
          "reservation_id": 1,
          "rating": 4,
          "title": "Great bike for trails",
          "comment": "The bike performed well on rough terrain.",
          "created_at": "2023-06-20T10:00:00.000000Z",
          "updated_at": "2023-06-20T10:00:00.000000Z",
          "user": {
            "id": 2,
            "name": "John Doe",
            "email": "john@example.com"
          },
          "bike": {
            "id": 1,
            "model": "Mountain Explorer",
            "brand": "Trek",
            "type": "Mountain"
          }
        }
      ],
      // ... pagination information
    }
  }
  ```

### Get Review Details

Get details of a specific review.

- **URL**: `/reviews/{id}`
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
    "message": "Review details retrieved successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_id": 1,
      "bike_inventory_id": 3,
      "reservation_id": 1,
      "rating": 4,
      "title": "Great bike for trails",
      "comment": "The bike performed well on rough terrain.",
      "created_at": "2023-06-20T10:00:00.000000Z",
      "updated_at": "2023-06-20T10:00:00.000000Z",
      "user": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bike": {
        "id": 1,
        "model": "Mountain Explorer",
        "brand": "Trek",
        "type": "Mountain",
        "description": "Robust mountain bike for rough terrain",
        "hourly_rate": "10.00",
        "daily_rate": "50.00"
      },
      "reservation": {
        "id": 1,
        "start_datetime": "2023-06-16T10:00:00.000000Z",
        "end_datetime": "2023-06-18T18:00:00.000000Z",
        "status": "completed"
      }
    }
  }
  ```
- **Note**: Users can only view their own reviews or public reviews for bikes. Admins can view all reviews.

### Create Review

Submit a new review for a bike after a completed reservation.

- **URL**: `/reviews`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "reservation_id": 1,
    "bike_id": 1,
    "bike_inventory_id": 3,
    "rating": 4,
    "title": "Great bike for trails",
    "comment": "The bike performed well on rough terrain."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": true,
    "message": "Review submitted successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_id": 1,
      "bike_inventory_id": 3,
      "reservation_id": 1,
      "rating": 4,
      "title": "Great bike for trails",
      "comment": "The bike performed well on rough terrain.",
      "created_at": "2023-06-20T10:00:00.000000Z",
      "updated_at": "2023-06-20T10:00:00.000000Z"
    }
  }
  ```
- **Validation Rules**:
  - `reservation_id`: Required, must exist in reservations table, must be a completed reservation, must belong to the current user
  - `bike_id`: Required, must exist in bikes table, must match the reservation's bike
  - `bike_inventory_id`: Required, must exist in bike_inventories table, must match the reservation's bike inventory
  - `rating`: Required, integer, between 1 and 5
  - `title`: Required, string, max 255 chars
  - `comment`: Optional, string
- **Note**: Users can only leave one review per reservation, and the reservation must be completed.

### Update Review

Update an existing review.

- **URL**: `/reviews/{id}`
- **Method**: `PUT`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "rating": 5,
    "title": "Excellent mountain bike",
    "comment": "After more thought, I realized this bike was even better than I initially rated it. Perfect for any trail!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Review updated successfully",
    "data": {
      "id": 1,
      "user_id": 2,
      "bike_id": 1,
      "bike_inventory_id": 3,
      "reservation_id": 1,
      "rating": 5,
      "title": "Excellent mountain bike",
      "comment": "After more thought, I realized this bike was even better than I initially rated it. Perfect for any trail!",
      "created_at": "2023-06-20T10:00:00.000000Z",
      "updated_at": "2023-06-21T15:00:00.000000Z"
    }
  }
  ```
- **Validation Rules**:
  - `rating`: Optional, integer, between 1 and 5
  - `title`: Optional, string, max 255 chars
  - `comment`: Optional, string
- **Note**: Users can only update their own reviews. Admins can update any review.

### Delete Review

Delete a review.

- **URL**: `/reviews/{id}`
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
    "message": "Review deleted successfully"
  }
  ```
- **Note**: Users can only delete their own reviews. Admins can delete any review.

### Get Bike Reviews

Get all reviews for a specific bike.

- **URL**: `/bikes/{bike_id}/reviews`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `per_page`: Items per page (default: 10)
  - `page`: Page number
  - `sort_by`: Field to sort by (rating, created_at)
  - `sort_direction`: 'asc' or 'desc' (default: 'desc')
  - `rating`: Filter by rating (1-5)
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "message": "Bike reviews retrieved successfully",
    "data": {
      "bike": {
        "id": 1,
        "model": "Mountain Explorer",
        "brand": "Trek",
        "type": "Mountain",
        "description": "Robust mountain bike for rough terrain",
        "hourly_rate": "10.00",
        "daily_rate": "50.00",
        "average_rating": 4.5,
        "review_count": 10
      },
      "reviews": {
        "current_page": 1,
        "data": [
          {
            "id": 1,
            "user_id": 2,
            "bike_id": 1,
            "rating": 5,
            "title": "Excellent mountain bike",
            "comment": "Perfect for any trail!",
            "created_at": "2023-06-20T10:00:00.000000Z",
            "updated_at": "2023-06-21T15:00:00.000000Z",
            "user": {
              "id": 2,
              "name": "John Doe"
            }
          },
          // ... more reviews
        ],
        // ... pagination information
      }
    }
  }
  ```
