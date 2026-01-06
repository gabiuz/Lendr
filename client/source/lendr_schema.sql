DROP DATABASE IF EXISTS lendr;
CREATE DATABASE lendr;
USE lendr;

/* ============================================================
   1. CUSTOMER TABLE
   ============================================================ */
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT UNIQUE DEFAULT NULL, 
    first_name VARCHAR(50) DEFAULT NULL,
    middle_name VARCHAR(50) DEFAULT NULL,
    last_name VARCHAR(50) DEFAULT NULL,
    gender VARCHAR(50) NOT NULL,
    birthday DATE NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number CHAR(12) NOT NULL UNIQUE,
    address VARCHAR(150) NOT NULL,
    account_password VARCHAR(100) DEFAULT NULL,
    date_account_made DATE NOT NULL DEFAULT (CURRENT_DATE()),
    user_profile_picture VARCHAR(255),

    CONSTRAINT check_customer_middlename 
        CHECK (middle_name IS NULL OR LENGTH(middle_name) > 1),
    CONSTRAINT check_customer_phone 
        CHECK (phone_number REGEXP '^639[0-9]{9}$')
) AUTO_INCREMENT = 1;

/* ============================================================
   2. RENTAL OWNER TABLE
   ============================================================ */
CREATE TABLE rental_owner (
    owner_id INT PRIMARY KEY AUTO_INCREMENT, 
    customer_id INT UNIQUE NOT NULL, 
    contact_email VARCHAR(50) UNIQUE,
    contact_number CHAR(12) NOT NULL UNIQUE, 
    business_name VARCHAR(75) NOT NULL UNIQUE,
    business_address VARCHAR(150) NOT NULL,
    business_description VARCHAR(500) DEFAULT NULL,
    postal_code CHAR(4) NOT NULL, 
    registration_date DATE DEFAULT (CURRENT_DATE()),
    business_profile_picture VARCHAR(255),

    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    CONSTRAINT check_owner_phone
        CHECK (contact_number REGEXP '^639[0-9]{9}$')
) AUTO_INCREMENT = 10;

-- Link customer back to owner
ALTER TABLE customer 
ADD CONSTRAINT fk_customer_is_owner 
FOREIGN KEY (owner_id) REFERENCES rental_owner(owner_id);

/* ============================================================
   3. CATEGORIES TABLE
   ============================================================ */
CREATE TABLE categories (
    category_code INT PRIMARY KEY AUTO_INCREMENT,
    category_type VARCHAR(50) NOT NULL,
    CONSTRAINT check_type CHECK (category_type IN (
        'Vehicles','Devices & Electronics','Clothing & Apparel',
        'Tools & Equipment','Furniture & Home','Party & Events'
    )),
    category_description VARCHAR(150) NOT NULL
) AUTO_INCREMENT = 100;

/* ============================================================
   4. PRODUCTS TABLE
   ============================================================ */
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT,
    category_code INT,
    product_name VARCHAR(100) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    product_rate DECIMAL(8, 2) NOT NULL,
    availability_status VARCHAR(50) NOT NULL,

    CONSTRAINT check_availability 
        CHECK (availability_status IN ('Available','Rented','Unavailable','Reserved')),

    posted_date DATE NOT NULL DEFAULT (CURRENT_DATE()),
    FOREIGN KEY (owner_id) REFERENCES rental_owner(owner_id),
    FOREIGN KEY (category_code) REFERENCES categories(category_code)
) AUTO_INCREMENT = 1000;

/* ============================================================
   5. PRODUCTS IMAGE TABLE
   ============================================================ */
CREATE TABLE products_image (
   image_id INT PRIMARY KEY AUTO_INCREMENT,
   product_id INT NOT NULL,
   image_path1 VARCHAR(255) NOT NULL,
   image_path2 VARCHAR(255) DEFAULT NULL,
   image_path3 VARCHAR(255) DEFAULT NULL,
   image_path4 VARCHAR(255) DEFAULT NULL,
   image_path5 VARCHAR(255) DEFAULT NULL,
   image_path6 VARCHAR(255) DEFAULT NULL,
   FOREIGN KEY (product_id) REFERENCES products(product_id)
) AUTO_INCREMENT = 10000;

/* ============================================================
   6. RENTALS TABLE
   ============================================================ */
CREATE TABLE rentals (
    rental_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(15) NOT NULL,

    CONSTRAINT check_rental_status CHECK (status IN ('To ship','Shipped','Completed', 'Cancelled')),
    CONSTRAINT check_dates CHECK (end_date >= start_date),

    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
) AUTO_INCREMENT = 1100;

/* ============================================================
   7. PAYMENTS TABLE
   ============================================================ */
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    rental_id INT NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(15) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(10) NOT NULL,
    
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id),
    CONSTRAINT check_paymentMethod CHECK (payment_method IN ('Cash', 'Gcash')),
    CONSTRAINT check_paymentStatus CHECK (payment_status IN ('Paid', 'Pending', 'Refunded', 'Failed'))
) AUTO_INCREMENT = 1500;

/* ============================================================
   8. REVIEWS TABLE
   ============================================================ */
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    rating DECIMAL(2, 1) NOT NULL,
    comment VARCHAR(500) DEFAULT NULL,
    created_at DATE NOT NULL DEFAULT (CURRENT_DATE()),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    CONSTRAINT check_rating CHECK (rating >= 0 AND rating <= 5)
) AUTO_INCREMENT = 2000;

/* ============================================================
   TRIGGERS
   ============================================================ */
DELIMITER //
CREATE TRIGGER before_review_insert
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE rental_count INT;
    
    SELECT COUNT(*) INTO rental_count
    FROM rentals
    WHERE customer_id = NEW.customer_id 
      AND product_id = NEW.product_id 
      AND status = 'Completed'; -- Modified to ensure logical "Completed" status

    IF rental_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Review Denied: You must complete a rental for this product before reviewing.';
    END IF;
END; //
DELIMITER ;

