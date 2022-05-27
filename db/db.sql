USE db_delivery;
CREATE TABLE users(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phone VARCHAR(10) NOT NULL UNIQUE,
    image VARCHAR(250) NULL,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);
INSERT INTO users(
        email,
        name,
        lastname,
        phone,
        image,
        password,
        created_at,
        updated_at
    )
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
SELECT id,
    email,
    name,
    lastname,
    image,
    password
FROM users
WHERE id = ?;
SELECT id,
    email,
    name,
    lastname,
    image,
    password
FROM users
WHERE email = ?;