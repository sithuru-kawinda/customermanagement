# Customer Management System

## Overview
A full-stack Customer Management System built with Spring Boot (Backend) and React (Frontend). This system allows you to manage customer information, including personal details, addresses, family members, and bulk customer uploads via Excel files.

## Features

### Customer Management
- ➕ Create new customers with mandatory fields (Name, DOB, NIC)
- ✏️ Update existing customer information
- 👁️ View customer details
- 📋 List all customers with pagination
- 🔍 Search customers by name or NIC
- 🗑️ Delete customer records

### Address Management
- 🏠 Multiple addresses per customer
- 🏙️ City and Country selection from master data
- 📍 Complete address details (Line 1, Line 2, City, Country)

### Family Members
- 👨‍👩‍👧‍👦 Link family members from existing customers
- 🔗 Define relationships (Spouse, Child, Parent, Sibling)
- 👤 Multiple family members per customer

### Bulk Upload
- 📊 Upload Excel files with up to 1,000,000 records
- 📈 Progress tracking for large files
- ✅ Data validation before upload
- 📥 Template download functionality

## Technology Stack

### Backend
- Java 8
- Spring Boot 2.7.0
- Spring Data JPA
- Spring Web MVC
- MariaDB / MySQL
- Maven
- Apache POI (Excel processing)
- JUnit 5 (Testing)

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios (HTTP client)
- React DatePicker
- React Toastify (Notifications)
- Bootstrap 5
- React Icons
- XLSX (Excel file handling)

## Prerequisites

### Required Software
- Java JDK 8 or higher
- Maven 3.6+
- MariaDB 10.5+ or MySQL 8.0+
- Node.js 14+ and npm 6+
- Git (optional)

### System Requirements
- RAM: Minimum 4GB (8GB recommended for bulk uploads)
- Disk Space: 500MB
- OS: Windows, Linux, or macOS

## Installation Guide

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE customer_management;
USE customer_management;

-- Create user (change password as needed)

# Navigate to backend directory
cd customer-management-backend

# Update database credentials in application.properties
# Edit src/main/resources/application.properties

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run

# Navigate to frontend directory
cd customer-management-frontend

# Install dependencies
npm install

# Start the application
npm start
CREATE USER 'customer_user'@'localhost' IDENTIFIED BY 'customer123';
GRANT ALL PRIVILEGES ON customer_management.* TO 'customer_user'@'localhost';
FLUSH PRIVILEGES;
