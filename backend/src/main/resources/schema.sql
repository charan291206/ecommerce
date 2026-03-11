-- ============================================================
--  E-Commerce Store - MySQL Schema & Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    slug       VARCHAR(110) NOT NULL UNIQUE,
    image_url  VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id  BIGINT NOT NULL,
    name         VARCHAR(255) NOT NULL,
    slug         VARCHAR(270) NOT NULL UNIQUE,
    description  TEXT,
    price        DECIMAL(10,2) NOT NULL,
    stock        INT NOT NULL DEFAULT 0,
    image_url    VARCHAR(500),
    sku          VARCHAR(80) UNIQUE,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_category  (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_price     (price)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name    VARCHAR(200) NOT NULL,
    customer_email   VARCHAR(200) NOT NULL,
    customer_phone   VARCHAR(30),
    shipping_address TEXT NOT NULL,
    total_amount     DECIMAL(12,2) NOT NULL,
    status           ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status         (status),
    INDEX idx_customer_email (customer_email),
    INDEX idx_created_at     (created_at)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ORDER ITEMS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    quantity    INT NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    subtotal    DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order   (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
--  SEED DATA
-- ============================================================

INSERT IGNORE INTO categories (name, slug, image_url) VALUES
('Electronics',  'electronics',  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400'),
('Clothing',     'clothing',     'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'),
('Home & Garden','home-garden',  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400'),
('Books',        'books',        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'),
('Sports',       'sports',       'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400');

INSERT IGNORE INTO products (category_id, name, slug, description, price, stock, image_url, sku) VALUES
-- Electronics
(1,'Wireless Noise-Cancelling Headphones','wireless-nc-headphones',
 'Premium over-ear headphones with 40-hour battery life and adaptive noise cancellation.',
 249.99, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400','SKU-ELEC-001'),
(1,'4K Smart TV 55"','4k-smart-tv-55',
 'Stunning 4K OLED display with built-in streaming apps and voice control.',
 899.00, 20, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400','SKU-ELEC-002'),
(1,'Mechanical Keyboard','mechanical-keyboard',
 'Tactile RGB mechanical keyboard with hot-swappable switches.',
 139.99, 75, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400','SKU-ELEC-003'),
(1,'USB-C Hub 7-in-1','usb-c-hub-7in1',
 'Expand your laptop with HDMI 4K, 3xUSB-A, SD card reader, and 100W PD.',
 59.99, 120, 'https://images.unsplash.com/photo-1625807500093-5bf4b9cf9f02?w=400','SKU-ELEC-004'),

-- Clothing
(2,'Classic Denim Jacket','classic-denim-jacket',
 'Timeless medium-wash denim jacket with adjustable waist tabs.',
 89.99, 200, 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400','SKU-CLTH-001'),
(2,'Merino Wool Crew Neck','merino-wool-crewneck',
 'Ultra-soft 100% merino wool sweater, naturally temperature-regulating.',
 119.00, 90, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400','SKU-CLTH-002'),
(2,'Performance Running Shorts','performance-running-shorts',
 'Lightweight 4-way stretch shorts with built-in liner and zip pocket.',
 44.99, 300, 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400','SKU-CLTH-003'),

-- Home & Garden
(3,'Cast Iron Skillet 12"','cast-iron-skillet-12',
 'Pre-seasoned cast iron for superior heat retention. Oven safe to 500F.',
 49.99, 60, 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=400','SKU-HOME-001'),
(3,'Indoor Herb Garden Kit','indoor-herb-garden-kit',
 'Self-watering planter with LED grow light. Grow basil, mint, and parsley year-round.',
 79.99, 45, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400','SKU-HOME-002'),
(3,'Linen Duvet Cover Set','linen-duvet-cover-set',
 'Stonewashed French linen. Breathable, gets softer with every wash. Queen size.',
 159.00, 35, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400','SKU-HOME-003'),

-- Books
(4,'Clean Code by Robert Martin','clean-code-robert-martin',
 'A handbook of agile software craftsmanship. Essential reading for every developer.',
 34.99, 150, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400','SKU-BOOK-001'),
(4,'Atomic Habits by James Clear','atomic-habits-james-clear',
 'An easy and proven way to build good habits and break bad ones.',
 27.99, 200, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400','SKU-BOOK-002'),

-- Sports
(5,'Yoga Mat Pro 6mm','yoga-mat-pro-6mm',
 'Non-slip natural rubber yoga mat with alignment lines. Eco-friendly.',
 68.00, 80, 'https://images.unsplash.com/photo-1601925228038-c8c6a7b00b90?w=400','SKU-SPRT-001'),
(5,'Adjustable Dumbbell Set','adjustable-dumbbell-set',
 'Space-saving 5-50 lb adjustable dumbbells. Replace 15 sets of weights.',
 349.00, 25, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400','SKU-SPRT-002');
 
 
 
UPDATE products SET is_active = 1;

UPDATE products SET created_at = NOW() WHERE created_at IS NULL;

SELECT id, name, is_active, created_at FROM products;