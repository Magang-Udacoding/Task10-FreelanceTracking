-- Create database
CREATE DATABASE IF NOT EXISTS db_omsets;
USE db_omsets;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table (Old)
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    client VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL
);

-- Projects table (New for Freelance Dashboard)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    client VARCHAR(100) NOT NULL,
    revenue DECIMAL(15,2) NOT NULL,
    hours INT DEFAULT 0,
    status ENUM('completed', 'pending', 'on-hold') DEFAULT 'pending',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Achievements table (New)
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY user_achievement (user_id, achievement_name)
);

-- Insert default settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
('target_bulanan', '25000000'),
('tahun_bulan_aktif', DATE_FORMAT(CURRENT_DATE, '%Y-%m'));

-- Insert default system users
INSERT IGNORE INTO users (id, username, email, password, role) VALUES 
(1, 'admin', 'admin@example.com', '$2y$10$LOBjQT9QPtUMpSuKGSt9UuB5aHg0kH04NxoFciX/EViTmoGLtYzH2', 'admin'),
(2, 'staff1', 'staff@example.com', '$2y$10$juHteGmIthmdptKEtkgIHejTe8iv3CTmee5yeeEvkXj6WClWmpVt6', 'staff');

-- Insert 15 New Partner Projects
INSERT IGNORE INTO projects (id, name, client, revenue, hours, status, priority, start_date, end_date, created_by) VALUES
(1, 'BCA OneKlik & QRIS Payment Gateway Module', 'BCA Digital (blu)', 19500000, 38, 'completed', 'high', '2026-10-01', '2026-10-18', 1),
(2, 'Fleet Fuel Consumption IoT Sensor Dashboard', 'Pertamina Digital Solution', 24000000, 45, 'pending', 'high', '2026-10-03', '2026-10-25', 1),
(3, 'Telemedicine Electronic Prescription Sync API', 'Kalbe Farma HealthTech', 16500000, 32, 'completed', 'medium', '2026-09-20', '2026-10-05', 1),
(4, 'Multi-Store POS Real-time Inventory Engine', 'Indomaret Retail Nusantara', 22000000, 42, 'pending', 'high', '2026-10-02', '2026-10-22', 1),
(5, 'Passenger QR Ticketing & Turnstile Scanner', 'KAI Commuter Tech', 21000000, 40, 'completed', 'high', '2026-09-15', '2026-10-02', 1),
(6, 'Doctor Telehealth Consultation & EMR Web Portal', 'Alodokter Telehealth', 14500000, 28, 'pending', 'medium', '2026-10-04', '2026-10-19', 1),
(7, 'Delivery Fleet Route Optimization & Geolocation API', 'SiCepat Ekspres Indonesia', 18000000, 35, 'completed', 'high', '2026-09-25', '2026-10-10', 1),
(8, 'Multi-Asset Portfolio Tracker & Live Crypto Feed', 'Pluang Investama Tech', 17500000, 34, 'pending', 'medium', '2026-10-06', '2026-10-24', 1),
(9, 'Mobile App Omnichannel Ordering & Loyalty Reward', 'Kopi Kenangan Group', 15000000, 30, 'completed', 'medium', '2026-09-18', '2026-10-04', 1),
(10, 'Flight & Hotel Booking Dynamic Pricing Algorithm', 'Tiket.com (Djarum Group)', 23500000, 46, 'on-hold', 'high', '2026-09-28', '2026-10-20', 1),
(11, 'Corporate Bulk Payout & Dispute Resolution Panel', 'Flip Indonesia', 19000000, 36, 'pending', 'high', '2026-10-05', '2026-10-26', 1),
(12, 'Adaptive Quiz Engine & Video Learning Player', 'Zenius Education', 13500000, 26, 'completed', 'low', '2026-09-12', '2026-09-30', 1),
(13, 'Vaccine Cold-Chain IoT Temperature Monitoring', 'Bio Farma Life Science', 26000000, 48, 'pending', 'high', '2026-10-08', '2026-10-28', 1),
(14, 'DRM E-Book Reader & Digital Library Subscription', 'Gramedia Digital', 14000000, 28, 'completed', 'medium', '2026-09-22', '2026-10-12', 1),
(15, 'Smart Coffee Machine Telemetry & Mobile App API', 'Fore Coffee Indonesia', 16000000, 31, 'pending', 'medium', '2026-10-07', '2026-10-27', 1);

-- Insert Invoices
INSERT IGNORE INTO invoices (id, project_name, client, amount, date, status, created_by) VALUES
(1, 'BCA OneKlik & QRIS Payment Gateway Module', 'BCA Digital (blu)', 19500000, '2026-10-01', 'paid', 1),
(2, 'Fleet Fuel Consumption IoT Sensor Dashboard', 'Pertamina Digital Solution', 24000000, '2026-10-03', 'pending', 1),
(3, 'Telemedicine Electronic Prescription Sync API', 'Kalbe Farma HealthTech', 16500000, '2026-09-20', 'paid', 1),
(4, 'Multi-Store POS Real-time Inventory Engine', 'Indomaret Retail Nusantara', 22000000, '2026-10-02', 'pending', 1),
(5, 'Passenger QR Ticketing & Turnstile Scanner', 'KAI Commuter Tech', 21000000, '2026-09-15', 'paid', 1),
(6, 'Doctor Telehealth Consultation & EMR Web Portal', 'Alodokter Telehealth', 14500000, '2026-10-04', 'pending', 1),
(7, 'Delivery Fleet Route Optimization & Geolocation API', 'SiCepat Ekspres Indonesia', 18000000, '2026-09-25', 'paid', 1),
(8, 'Multi-Asset Portfolio Tracker & Live Crypto Feed', 'Pluang Investama Tech', 17500000, '2026-10-06', 'pending', 1),
(9, 'Mobile App Omnichannel Ordering & Loyalty Reward', 'Kopi Kenangan Group', 15000000, '2026-09-18', 'paid', 1),
(10, 'Flight & Hotel Booking Dynamic Pricing Algorithm', 'Tiket.com (Djarum Group)', 23500000, '2026-09-28', 'overdue', 1),
(11, 'Corporate Bulk Payout & Dispute Resolution Panel', 'Flip Indonesia', 19000000, '2026-10-05', 'pending', 1),
(12, 'Adaptive Quiz Engine & Video Learning Player', 'Zenius Education', 13500000, '2026-09-12', 'paid', 1),
(13, 'Vaccine Cold-Chain IoT Temperature Monitoring', 'Bio Farma Life Science', 26000000, '2026-10-08', 'pending', 1),
(14, 'DRM E-Book Reader & Digital Library Subscription', 'Gramedia Digital', 14000000, '2026-09-22', 'paid', 1),
(15, 'Smart Coffee Machine Telemetry & Mobile App API', 'Fore Coffee Indonesia', 16000000, '2026-10-07', 'pending', 1);