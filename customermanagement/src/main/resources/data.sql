-- Insert sample master data if needed
INSERT INTO customers (name, date_of_birth, nic_number, created_at, updated_at) 
VALUES 
('John Doe', '1990-01-15', '123456789V', CURDATE(), CURDATE()),
('Jane Smith', '1985-05-20', '987654321V', CURDATE(), CURDATE());