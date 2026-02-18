# Bikes API Documentation

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