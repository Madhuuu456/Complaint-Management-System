-- Optional: the server creates all of this automatically on first start.
CREATE DATABASE IF NOT EXISTS madhu_complaints;
USE madhu_complaints;
CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100),email VARCHAR(150) UNIQUE,password VARCHAR(255),role ENUM('user','admin') DEFAULT 'user',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS complaints(id INT AUTO_INCREMENT PRIMARY KEY,ticket VARCHAR(20) UNIQUE,user_id INT,title VARCHAR(200),category VARCHAR(50),priority VARCHAR(20),description TEXT,status ENUM('Pending','In Progress','Resolved','Rejected') DEFAULT 'Pending',admin_note TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS messages(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100),email VARCHAR(150),message TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
