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
   PRODUCTS IMAGE TABLE
   (renamed to hold product photos)
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
    status VARCHAR(15) NOT NULL,

    CONSTRAINT check_rental_status CHECK (status IN ('To ship','Shipped','Completed', 'Cancelled')),
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
        CHECK (payment_status IN ('Paid','Pending','Refunded','Failed')),
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
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
   TRIGGER: BUSINESS RULE FOR REVIEWS
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
      AND end_date < CURRENT_DATE();

    IF rental_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Review Denied: You must complete a rental for this product before reviewing.';
    END IF;
END; //
DELIMITER ;

/* ============================================================
   INSERT SAMPLE DATA (PASSWORDS HASHED VIA SHA2)
   ============================================================ */

INSERT INTO customer(first_name,middle_name,last_name,gender,birthday,email,phone_number,address,account_password)
VALUES
('John','April','Doe','Male','1999-03-03','john@gmail.com','639123456780','100 Banana St., Manila City', SHA2('password123',256)),
('Jane','Bearni','Smith','Female','2000-07-12','jane@gmail.com','639123456781','25 Mango Road, Caloocan City', SHA2('janePass!',256)),
('Mark','Cathy','Lee','Male','1998-02-21','mark@gmail.com','639123456782','15 Coconut Ave., Quezon City', SHA2('mark_secure',256)),
('Anna','Dela Cruz','Reyes','Female','1999-04-11','anna@gmail.com','639123456783','88 Papaya St., Pasig City', SHA2('annapass',256)),
('Luke','Emilia','Flores','Male','2001-09-15','luke@gmail.com','639123456784','12 Guava Lane, Makati City', SHA2('luke_1234',256)),
('Ella','Florence','Ramirez','Female','2002-01-17','ella@gmail.com','639123456785','75 Durian Drive, Pasay City', SHA2('ella_pw',256)),
('Carl','Georgean','Lopez','Male','1997-06-20','carl@gmail.com','639123456786','42 Lanzones St., Taguig City', SHA2('carl_pass',256)),
('Faith','Hindura','Castro','Female','2000-12-25','faith@gmail.com','639123456787','90 Melon Road, Bulacan', SHA2('faithpw',256)),
('Neil','Itura','Torres','Male','1998-11-09','neil@gmail.com','639123456788','67 Rambutan St., Laguna', SHA2('neilsecure',256)),
('Rose','Janelyn','Santos','Female','2001-08-08','rose@gmail.com','639123456789','30 Pineapple Ave., Cavite', SHA2('rosepass',256));

/* ============================================================
   RENTAL OWNERS
   ============================================================ */
INSERT INTO rental_owner(customer_id,contact_email,contact_number,business_name,business_address,postal_code)
VALUES
(1,'carlos@biz.com','639999999990','Dizon Rentals','120 Apple St., Manila City','1000'),
(2,'maria@biz.com','639999999991','Lopez Events','55 Orange Ave., Quezon City','1100'),
(3,'kevin@biz.com','639999999992','Reyes Motors','77 Grapes Road, Pasig City','1600'),
(4,'ella@biz.com','639999999993','Cruz Tech','90 Lemon Drive, Makati City','1200'),
(5,'tony@biz.com','639999999994','TG Tools','18 Cherry St., Taguig City','1630'),
(6,'rina@biz.com','639999999995','Santos Furnitures','230 Peach Lane, Pasay City','1300'),
(7,'jomar@biz.com','639999999996','Flores Apparel','15 Kiwi St., Caloocan City','1420'),
(8,'bea@biz.com','639999999997','Lim Electronics','300 Avocado Road, Mandaluyong City','1550'),
(9,'albert@biz.com','639999999998','Go Rentals','80 Lychee St., San Juan City','1500'),
(10,'sofia@biz.com','639999999999','Tan Events','40 Watermelon Ave., Marikina City','1800');

-- Update customer owner_id links
UPDATE customer SET owner_id = 10 WHERE customer_id = 1;
UPDATE customer SET owner_id = 11 WHERE customer_id = 2;
UPDATE customer SET owner_id = 12 WHERE customer_id = 3;
UPDATE customer SET owner_id = 13 WHERE customer_id = 4;
UPDATE customer SET owner_id = 14 WHERE customer_id = 5;
UPDATE customer SET owner_id = 15 WHERE customer_id = 6;
UPDATE customer SET owner_id = 16 WHERE customer_id = 7;
UPDATE customer SET owner_id = 17 WHERE customer_id = 8;
UPDATE customer SET owner_id = 18 WHERE customer_id = 9;
UPDATE customer SET owner_id = 19 WHERE customer_id = 10;

/* ============================================================
   CATEGORIES
   ============================================================ */
INSERT INTO categories(category_type,category_description)
VALUES
('Vehicles','Cars, motorcycles, and other vehicles'),
('Devices & Electronics','Phones, laptops, gadgets'),
('Clothing & Apparel','Wearable items'),
('Tools & Equipment','Hardware tools'),
('Furniture & Home','Home and living items'),
('Party & Events','Event supplies');

/* ============================================================
   NOTE: Sample product/rental/payment/review seed data removed.
   Products and photos should be created via the application.
   ============================================================ */