DROP DATABASE IF EXISTS lendr;
CREATE DATABASE lendr;
USE lendr;

/* ============================================================
   1. CUSTOMER TABLE
   ============================================================ */
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT UNIQUE DEFAULT NULL, -- Link to owner profile (Optional)
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
    customer_id INT UNIQUE NOT NULL, -- The base user account
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

-- Now that rental_owner exists, we link the customer's owner_id back to it
ALTER TABLE customer 
ADD CONSTRAINT fk_customer_is_owner 
FOREIGN KEY (owner_id) REFERENCES rental_owner(owner_id);

/* ============================================================
   CATEGORIES TABLE
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
   PRODUCTS TABLE
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
   PRODUCT IMAGE TABLE
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
   RENTALS TABLE
   ============================================================ */
CREATE TABLE rentals (
    rental_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(25) NOT NULL,
    delivery_option VARCHAR(50) DEFAULT 'Pick Up',

    CONSTRAINT check_rental_status CHECK (status IN ('To ship','Out for Delivery','Delivered','Return Shipped','Completed', 'Cancelled')),
    CONSTRAINT check_delivery_option CHECK (delivery_option IN ('Pick Up', 'Lalamove')),
    CONSTRAINT check_dates CHECK (end_date >= start_date),

    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
) AUTO_INCREMENT = 1100;

/* ============================================================
   PAYMENTS TABLE
   ============================================================ */
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    rental_id INT,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(15) NOT NULL,
    CONSTRAINT check_paymentMethod CHECK (payment_method IN ('Cash','E-Wallet')),
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(10) NOT NULL,
    CONSTRAINT check_paymentStatus 
        CHECK (payment_status IN ('Paid','Pending','Refunded', 'Cancelled')),
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
) AUTO_INCREMENT = 1500;

/* ============================================================
   8. REVIEWS TABLE
   ============================================================ */
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    rental_id INT,
    rating DECIMAL(2, 1) NOT NULL,
    comment VARCHAR(500) DEFAULT NULL,
    created_at DATE NOT NULL DEFAULT (CURRENT_DATE()),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id),
    CONSTRAINT check_rating CHECK (rating >= 0 AND rating <= 5)
) AUTO_INCREMENT = 2000;

/* ============================================================
   TRIGGER: BUSINESS RULE FOR REVIEWS
   ============================================================ */
DELIMITER //
CREATE TRIGGER before_review_insert
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE rental_status VARCHAR(50);
    DECLARE existing_review_count INT;
    
    -- Check if the rental exists and is completed
    SELECT status INTO rental_status
    FROM rentals
    WHERE rental_id = NEW.rental_id;

    IF rental_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Review Denied: Invalid rental ID.';
    END IF;

    IF rental_status != 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Review Denied: You can only review after completing a rental.';
    END IF;

    -- Check if a review already exists for this rental
    SELECT COUNT(*) INTO existing_review_count
    FROM reviews
    WHERE rental_id = NEW.rental_id;

    IF existing_review_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Review Denied: A review for this rental already exists.';
    END IF;
END; //
DELIMITER ;

/* ============================================================
   TRIGGER: BUSINESS RULE FOR OWNER CONTACT EMAIL
   ============================================================ */
DELIMITER //
CREATE TRIGGER before_owner_insert
BEFORE INSERT ON rental_owner
FOR EACH ROW
BEGIN
    DECLARE customer_email VARCHAR(50);
    
    SELECT email INTO customer_email
    FROM customer
    WHERE customer_id = NEW.customer_id;

    IF NEW.contact_email IS NOT NULL AND NEW.contact_email = customer_email THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Contact email must be different from personal email.';
    END IF;
END; //
DELIMITER ;

/* ============================================================
   TRIGGER: BUSINESS RULE FOR OWNER CONTACT EMAIL - UPDATE
   ============================================================ */
DELIMITER //
CREATE TRIGGER before_owner_update
BEFORE UPDATE ON rental_owner
FOR EACH ROW
BEGIN
    DECLARE customer_email VARCHAR(50);
    
    SELECT email INTO customer_email
    FROM customer
    WHERE customer_id = NEW.customer_id;

    IF NEW.contact_email IS NOT NULL AND NEW.contact_email = customer_email THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Contact email must be different from personal email.';
    END IF;
END; //
DELIMITER ;

INSERT INTO categories(category_type,category_description)
VALUES
('Vehicles','Cars, motorcycles, and other vehicles'),
('Devices & Electronics','Phones, laptops, gadgets'),
('Clothing & Apparel','Wearable items'),
('Tools & Equipment','Hardware tools'),
('Furniture & Home','Home and living items'),
('Party & Events','Event supplies');