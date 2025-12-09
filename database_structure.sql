-- ============================================
-- TechHelpDesk Database Structure
-- PostgreSQL Schema with Initial Data
-- ============================================

-- ============================================
-- TABLE: users
-- Description: Base user entity for authentication
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'CLIENT', 'TECHNICIAN')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: categories
-- Description: Support ticket categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: clients
-- Description: Client profiles (extends users)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: technicians
-- Description: Technician profiles (extends users)
-- ============================================
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    specialization VARCHAR(255),
    max_workload INTEGER DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_technician_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: tickets
-- Description: Support tickets
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')) DEFAULT 'OPEN',
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')) DEFAULT 'MEDIUM',
    category_id UUID NOT NULL,
    client_id UUID NOT NULL,
    technician_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_technician FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL
);

-- ============================================
-- INDEXES for Performance Optimization
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category_id);
CREATE INDEX IF NOT EXISTS idx_tickets_client ON tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_technician ON tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_technicians_user ON technicians(user_id);

-- ============================================
-- INITIAL DATA: Categories
-- ============================================
INSERT INTO categories (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hardware', 'Hardware-related technical issues and support'),
('550e8400-e29b-41d4-a716-446655440002', 'Software', 'Software installation, configuration, and troubleshooting'),
('550e8400-e29b-41d4-a716-446655440003', 'Network', 'Network connectivity and infrastructure issues'),
('550e8400-e29b-41d4-a716-446655440004', 'Security', 'Security incidents and access management'),
('550e8400-e29b-41d4-a716-446655440005', 'General Support', 'General technical support requests')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INITIAL DATA: Admin User
-- Note: Password is 'Admin123!' (bcrypt hashed)
-- ============================================
INSERT INTO users (id, name, email, password, role) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'System Admin', 'admin@techhelpdesk.com', '$2b$10$YourHashedPasswordHere', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- INITIAL DATA: Sample Technician
-- Note: Password is 'Tech123!' (bcrypt hashed)
-- ============================================
INSERT INTO users (id, name, email, password, role) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'John Tech', 'john.tech@techhelpdesk.com', '$2b$10$YourHashedPasswordHere', 'TECHNICIAN')
ON CONFLICT (email) DO NOTHING;

INSERT INTO technicians (id, user_id, specialization, max_workload, is_available) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440011', 'Network Infrastructure', 5, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- INITIAL DATA: Sample Client
-- Note: Password is 'Client123!' (bcrypt hashed)
-- ============================================
INSERT INTO users (id, name, email, password, role) VALUES
('550e8400-e29b-41d4-a716-446655440012', 'Jane Doe', 'jane.doe@example.com', '$2b$10$YourHashedPasswordHere', 'CLIENT')
ON CONFLICT (email) DO NOTHING;

INSERT INTO clients (id, user_id, phone, address) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440012', '+1234567890', '123 Main Street, City')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- INITIAL DATA: Sample Ticket
-- ============================================
INSERT INTO tickets (id, title, description, status, priority, category_id, client_id, technician_id) VALUES
('550e8400-e29b-41d4-a716-446655440040', 
 'Cannot connect to office network', 
 'Having trouble connecting to the VPN from home office', 
 'OPEN', 
 'MEDIUM', 
 '550e8400-e29b-41d4-a716-446655440003', 
 '550e8400-e29b-41d4-a716-446655440030', 
 NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTES:
-- 1. Replace '$2b$10$YourHashedPasswordHere' with actual bcrypt hashed passwords
-- 2. UUIDs are fixed for initial data to maintain referential integrity
-- 3. Timestamps will be auto-generated on insert
-- 4. This script is idempotent (safe to run multiple times)
-- ============================================
