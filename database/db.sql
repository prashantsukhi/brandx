-- to create a new database
CREATE DATABASE lockers;

-- to use database
use lockers;

-- creating a new table
CREATE TABLE customer (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  mobile_no VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  locker_code VARCHAR(50) NOT NULL,
  profile_img VARCHAR(100) NOT NULL
);

CREATE TABLE code (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  status INT(1) ZEROFILL NOT NULL
);

-- to show all tables
show tables;

-- to describe table
describe customer;
describe code;
