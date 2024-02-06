
--  Creating database of OCR 
DROP DATABASE IF EXISTS ocr_db;
CREATE DATABASE ocr_db;
USE ocr_db ;

-- CREATING USERS TABLE

DROP TABLE IF EXISTS users;
CREATE TABLE users(
	id VARCHAR(50) PRIMARY KEY NOT NULL,
    name VARCHAR(500) NOT NULL,
    lastname VARCHAR(500) NOT NULL,
    username VARCHAR(500) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);
TRUNCATE TABLE users;
-- INSERT INTO users (id, name, lastname, username, password)  VALUES ('u1','Harit','Tilavat','harit@123','1234');
SELECT * FROM users;

-- CREATING DOCUMENTS TABLE

DROP TABLE IF EXISTS documents;
CREATE TABLE documents(
	doc_id VARCHAR(500) NOT NULL PRIMARY KEY,
    image_url VARCHAR(500),
	vendor_name VARCHAR(500),
    total DECIMAL(20,2),
    category VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    document_type VARCHAR(500),
    invoice_number VARCHAR(500),
    ocr_text TEXT
);

ALTER TABLE documents 
MODIFY image_url VARCHAR(50) DEFAULT '/uploads/not-found.jpg';
TRUNCATE TABLE documents;
--  Inserting data
INSERT INTO documents (doc_id,image_url,vendor_name,total,category,document_type,invoice_number,ocr_text) 
VALUES ('d1','/uploads/files/1705497205162dmart_invoice.png','vendor name',10000.00,'recepit','123456','category','Hello. This is some text! \n\nHow are you ?');

SELECT * FROM documents order by created_at DESC;

