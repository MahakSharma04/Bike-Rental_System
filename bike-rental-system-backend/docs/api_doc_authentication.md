# Authentication API Documentation

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