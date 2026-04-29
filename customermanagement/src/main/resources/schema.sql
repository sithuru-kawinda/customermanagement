-- Create database
CREATE DATABASE IF NOT EXISTS customer_management;
USE customer_management;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    nic_number VARCHAR(50) NOT NULL UNIQUE,
    created_at DATE,
    updated_at DATE,
    INDEX idx_nic_number (nic_number),
    INDEX idx_name (name)
);

-- Customer mobile numbers table
CREATE TABLE IF NOT EXISTS customer_mobile_numbers (
    customer_id BIGINT NOT NULL,
    mobile_number VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_mobile_number (mobile_number)
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    address_line1 VARCHAR(500),
    address_line2 VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_country (country)
);

-- Family members table
CREATE TABLE IF NOT EXISTS family_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_customer_id BIGINT NOT NULL,
    customer_id BIGINT,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50),
    nic_number VARCHAR(50),
    FOREIGN KEY (parent_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_relationship (relationship)
);