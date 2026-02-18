# Reviews API Documentation

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