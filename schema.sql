create database lendr;

use lendr;

-- table structure for customer
create table customer(
	customer_id varchar(11) primary key,
    first_name varchar(50) not null,
    middle_name varchar(50) default null,
    last_name varchar(50) not null,
    gender varchar(50) not null,
    birthday date not null,
    email varchar(50) not null,
    phone_number varchar(15) not null,
    address varchar(150) not null,
    date_account_made date not null
);

-- table structure for rental owner
create table rental_owner(
	owner_id varchar(11) primary key, 
	first_name varchar(50) not null,
    middle_name varchar(50) default null,
    last_name varchar(50) not null,
    contact_email varchar(50) unique,
    contact_number varchar(11) not null unique,
    business_name varchar(75) not null unique,
    business_address varchar(150) not null,
    postal_code int,
    registration_date date
);

-- table structure for categories
create table categories (
	category_code varchar(11) primary key,
		constraint check_code check (category_code IN ("V", "DE", "CA", "TE", "FH","PE")),
    category_type varchar(50),
		constraint check_type check (category_type IN (
        "Vehicles", 
		"Devices & Electronics",
		"Clothing & Apparel",
		"Tools & Equipment"
		"Furniture & Home"
		"Party & Events")),
	category_description varchar(150) not null
);

-- table structure for products
create table products (
	product_id varchar(11) primary key,
    owner_id varchar(11),
    category_code varchar(11),
    product_name varchar(100) not null,
    description varchar(500) default null,
    product_rate decimal(8, 2) not null,
    availability_status varchar(50) not null,
		constraint check_availability check (availability_status in ("Available", "Rented", "Unavailable", "Reserved")),
	posted_date date not null,
    foreign key (owner_id) references rental_owner(owner_id),
    foreign key (category_code) references categories(category_code)
);

-- table structure for rentals
create table rentals (
	rental_id varchar(11) primary key,
    product_id varchar(11),
    customer_id varchar(11),
	start_date date not null,
    end_date date not null,
    total_amount decimal(6, 2) not null,
    payment_id varchar(15) not null,
    status varchar(10) not null,
		constraint check_status check (status in ("To ship", "Shipped", "Completed")),
	foreign key (product_id) references products(product_id),
    foreign key (customer_id) references customer(customer_id)
);

-- table structure for payments
create table payments (
	payment_id varchar(15) primary key,
    rental_id varchar(10),
    payment_date date not null,
    payment_method varchar(15) not null,
		constraint check_paymentMethod check (payment_method in ("Cash", "E-Wallet")),
	amount_paid decimal(10, 2) not null,
    payment_status varchar(10) not null,
		constraint check_paymentStatus check (payment_status in ("Paid", "Pending", "Refunded", "Failed")),
	foreign key (rental_id) references rentals(rental_id)
);

-- table structure for reviews
create table reviews (
	review_id varchar(11) primary key,
    product_id varchar(11),
    customer_id varchar(11),
    rating decimal(2, 1) not null,
    comment varchar(500) default null,
    created_at date not null,
    foreign key (product_id) references products(product_id),
    foreign key (customer_id) references customer(customer_id)
);


