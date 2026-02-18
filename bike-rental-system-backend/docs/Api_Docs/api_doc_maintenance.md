# Maintenance API Documentation

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