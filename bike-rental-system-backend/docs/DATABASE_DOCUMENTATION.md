# Bike Rental System - Database Documentation

## Overview

This document provides a comprehensive explanation of the Bike Rental System's database schema, table relationships, and system architecture. The system is designed to manage a bike rental business with features for inventory tracking, reservations, payments, maintenance, and customer reviews.

## Database Schema

The system is built around the following core tables:

### Core Tables

#### Bikes
Represents bike models available for rent (not individual physical bikes).

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| model | string | Bike model name |
| brand | string | Manufacturer |
| type | string | Type (mountain, road, city, etc.) |
| description | text | Detailed description |
| hourly_rate | decimal | Cost per hour |
| daily_rate | decimal | Cost per day |
| images | json | Array of image paths |
| status | string | Active or inactive |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### BikeInventory
Represents individual physical bikes in inventory.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| bike_id | bigint | Foreign key to bikes table |
| serial_number | string | Unique identifier |
| color | string | Bike color |
| year_manufactured | integer | Year of manufacture |
| location | string | Storage location |
| condition | string | Physical condition |
| status | string | Available, rented, maintenance, damaged |
| last_maintenance_date | date | Date of last maintenance |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### Users
Stores customer and administrator accounts.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| name | string | Full name |
| email | string | Email address (unique) |
| password | string | Hashed password |
| phone_number | string | Contact number |
| address | text | Physical address |
| driving_license_number | string | License ID for verification |
| role | string | User role (customer or admin) |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### Reservations
Tracks bike rental bookings.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users table |
| bike_inventory_id | bigint | Foreign key to bike_inventory table |
| start_datetime | datetime | Rental start time |
| end_datetime | datetime | Rental end time |
| total_amount | decimal | Calculated rental cost |
| status | string | Pending, confirmed, completed, cancelled, rejected |
| cancellation_reason | text | Optional reason if cancelled |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### Payments
Records payment transactions.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| reservation_id | bigint | Foreign key to reservations table |
| user_id | bigint | Foreign key to users table |
| amount | decimal | Payment amount |
| payment_method | string | Method used (credit card, razorpay, etc.) |
| transaction_id | string | External payment processor ID |
| status | string | Pending, completed, failed, refunded |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### MaintenanceRecords
Tracks bike maintenance activities.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| bike_inventory_id | bigint | Foreign key to bike_inventory table |
| maintenance_type | string | Routine or repair |
| description | text | Maintenance details |
| cost | decimal | Service cost |
| scheduled_date | date | Planned date |
| completed_date | date | Actual completion date |
| status | string | Scheduled, in-progress, completed |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### DamageReports
Documents damage to rental bikes.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| reservation_id | bigint | Foreign key to reservations table |
| bike_inventory_id | bigint | Foreign key to bike_inventory table |
| user_id | bigint | Foreign key to users table |
| description | text | Damage details |
| severity | string | Minor, moderate, severe |
| status | string | Reported, under review, repair scheduled, repaired |
| images | json | Array of damage image paths |
| additional_charges | decimal | Extra charges assessed |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

#### Reviews
Stores customer feedback.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users table |
| reservation_id | bigint | Foreign key to reservations table |
| bike_id | bigint | Foreign key to bikes table |
| rating | integer | 1-5 star rating |
| title | string | Review title |
| comment | text | Detailed feedback |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

## Relationships

### Bike Model to Inventory
- One-to-Many: A bike model (Bikes) can have multiple physical instances (BikeInventory)
- Foreign key: `bike_inventory.bike_id` references `bikes.id`

### BikeInventory to Reservations
- One-to-Many: A physical bike can have multiple reservations (but not simultaneously)
- Foreign key: `reservations.bike_inventory_id` references `bike_inventory.id`
- Constraint: Availability enforced through date range validation

### Users to Reservations
- One-to-Many: A user can have multiple reservations
- Foreign key: `reservations.user_id` references `users.id`

### Reservations to Payments
- One-to-Many: A reservation can have multiple payment records (installments, refunds)
- Foreign key: `payments.reservation_id` references `reservations.id`

### BikeInventory to MaintenanceRecords
- One-to-Many: A physical bike can have multiple maintenance records
- Foreign key: `maintenance_records.bike_inventory_id` references `bike_inventory.id`

### Reservations to DamageReports
- One-to-Many: A reservation can have multiple damage reports
- Foreign keys: 
  - `damage_reports.reservation_id` references `reservations.id`
  - `damage_reports.bike_inventory_id` references `bike_inventory.id`

### Users to Reviews
- One-to-Many: A user can submit multiple reviews
- Foreign key: `reviews.user_id` references `users.id`

### Reservations to Reviews
- One-to-One: A reservation can have at most one review
- Foreign key: `reviews.reservation_id` references `reservations.id`
- Constraint: Reviews can only be submitted for completed reservations

## System Features

### Inventory Management
- Separation between bike models (Bikes) and physical instances (BikeInventory)
- Track individual bikes by serial number, color, and condition
- Monitor maintenance history and current status of each bike
- Automated status updates based on reservations and maintenance

### Reservation System
- Check bike availability based on requested dates
- Calculate rental costs based on duration and rates
- Status workflow: pending → confirmed → completed (or cancelled/rejected)
- Conflict prevention through date range validation

### Maintenance Tracking
- Schedule routine maintenance or repairs
- Track maintenance costs and history
- Automatically update bike status during maintenance periods
- Prevent reservations for bikes scheduled for maintenance

### Damage Reporting
- Document damage with descriptions and images
- Assess severity and additional charges
- Track repair status
- Link damage to specific reservations and customers

### Review System
- Collect customer feedback on their rental experience
- Associate reviews with specific reservations and bike models
- Calculate average ratings for bike models
- Limit users to one review per reservation

### Payment Processing
- Integration with payment gateways (Razorpay)
- Track payment status and transaction details
- Handle refunds for cancellations
- Calculate revenue metrics

### User Management
- Role-based access control (customer vs admin)
- Store user verification information
- Manage customer profiles and rental history

## Access Control

### Admin Users
- Full CRUD operations on all resources
- Access to maintenance and damage management
- View all reservations and rental history
- Manage bike inventory and pricing
- Process refunds and handle customer issues

### Customer Users
- View and book available bikes
- Manage personal reservations (view, modify, cancel)
- Submit reviews for completed rentals
- Report damages during rental period
- View personal rental history and payments

## Architecture Overview

The Bike Rental System database is designed with a robust relational structure that balances:

1. **Real-world mapping**: The separation between bike models and physical inventory accurately represents the business domain.

2. **Scalability**: The system can accommodate growth in inventory, users, and reservations without significant structural changes.

3. **Detailed tracking**: Comprehensive history of rentals, maintenance, and damages for each bike.

4. **Flexible inventory management**: Bikes can be added, retired, or temporarily removed from service without losing historical data.

5. **Comprehensive reporting**: The data structure supports detailed reports on utilization, revenue, maintenance costs, and customer satisfaction.

The relationships between tables ensure data integrity while maintaining the flexibility needed for a dynamic rental business, with proper timestamping to track the sequence of events across the system. 