# Bike Inventory API Documentation

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