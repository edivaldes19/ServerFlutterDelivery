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

INSERT INTO
    users(
        email,
        name,
        lastname,
        phone,
        image,
        password,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?);

SELECT
    id,
    email,
    name,
    lastname,
    image,
    password
FROM
    users
WHERE
    id = ?;

SELECT
    id,
    email,
    name,
    lastname,
    image,
    password
FROM
    users
WHERE
    email = ?;

CREATE TABLE roles(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    image VARCHAR(250) NULL,
    route VARCHAR(50) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO
    roles(name, route, created_at, updated_at)
VALUES
    (
        'Restaurante',
        '/restaurant/orders/list',
        '30-05-22',
        '30-05-22'
    );

INSERT INTO
    roles(name, route, created_at, updated_at)
VALUES
    (
        'Repartidor',
        '/delivery/orders/list',
        '30-05-22',
        '30-05-22'
    );

INSERT INTO
    roles(name, route, created_at, updated_at)
VALUES
    (
        'Cliente',
        '/client/products/list',
        '30-05-22',
        '30-05-22'
    );

CREATE TABLE user_has_roles(
    id_user BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id_user, id_rol)
);

INSERT INTO
    user_has_roles(id_user, id_rol, created_at, updated_at)
VALUES
    (?, ?, ?, ?);

SELECT
    CONVERT(U.id, char) AS id,
    U.email,
    U.name,
    U.lastname,
    U.phone,
    U.image,
    U.password,
    U.notification_token,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id',
            CONVERT(R.id, char),
            'name',
            R.name,
            'image',
            R.image,
            'route',
            R.route
        )
    ) AS roles
FROM
    users AS U
    INNER JOIN user_has_roles AS UHR ON UHR.id_user = U.id
    INNER JOIN roles AS R ON UHR.id_rol = R.id
WHERE
    U.id = ?
GROUP BY
    U.id;

SELECT
    U.id,
    U.email,
    U.name,
    U.lastname,
    U.phone,
    U.image,
    U.password,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id',
            CONVERT(R.id, char),
            'name',
            R.name,
            1 'image',
            R.image,
            'route',
            R.route
        )
    ) AS roles
FROM
    users AS U
    INNER JOIN user_has_roles AS UHR ON UHR.id_user = U.id
    INNER JOIN roles AS R ON UHR.id_rol = R.id
WHERE
    email = ?
GROUP BY
    U.id;

UPDATE
    users
SET
    name = ?,
    lastname = ?,
    phone = ?,
    image = ?,
    updated_at = ?
WHERE
    id = ?;

CREATE TABLE categories(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

SELECT
    CONVERT(id, char) AS id,
    name,
    description
FROM
    categories
ORDER BY
    name;

INSERT INTO
    categories(
        name,
        description,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?);

CREATE TABLE products(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image1 VARCHAR(255) NULL,
    image2 VARCHAR(255) NULL,
    image3 VARCHAR(255) NULL,
    id_category BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO
    products(
        name,
        description,
        price,
        image1,
        image2,
        image3,
        id_category,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?);

UPDATE
    products
SET
    name = ?,
    description = ?,
    price = ?,
    image1 = ?,
    image2 = ?,
    image3 = ?,
    id_category = ?,
    updated_at = ?
WHERE
    id = ?;

SELECT
    CONVERT(P.id, char) AS id,
    P.name,
    P.description,
    P.price,
    P.image1,
    P.image2,
    P.image3,
    CONVERT(P.id_category, char) AS id_category
FROM
    products AS P
WHERE
    P.id_category = ?;

SELECT
    CONVERT(P.id, char) AS id,
    P.name,
    P.description,
    P.price,
    P.image1,
    P.image2,
    P.image3,
    CONVERT(P.id_category, char) AS id_category
FROM
    products AS P
WHERE
    P.id_category = ?
    AND LOWER(P.name) LIKE ?;

CREATE TABLE address(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    reference VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    id_user BIGINT NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

SELECT
    CONVERT(id, char) AS id,
    name,
    address,
    reference,
    latitude,
    longitude,
    CONVERT(id_user, char) AS id_user
FROM
    address
WHERE
    id_user = ?;

INSERT INTO
    address(
        name,
        address,
        reference,
        latitude,
        longitude,
        id_user,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?);

CREATE TABLE orders(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_client BIGINT NOT NULL,
    id_delivery BIGINT NULL,
    id_address BIGINT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE order_has_products(
    id_order BIGINT NOT NULL,
    id_product BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    PRIMARY KEY(id_order, id_product),
    FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

/**********ORDERS**********/
SELECT
    CONVERT(O.id, char) AS id,
    CONVERT(O.id_client, char) AS id_client,
    CONVERT(O.id_address, char) AS id_address,
    CONVERT(O.id_delivery, char) AS id_delivery,
    O.status,
    O.timestamp,
    O.lat,
    O.lng,
    JSON_OBJECT(
        'id',
        CONVERT(A.id, char),
        'address',
        A.address,
        'reference',
        A.reference,
        'lat',
        A.lat,
        'lng',
        A.lng
    ) AS address,
    JSON_OBJECT(
        'id',
        CONVERT(U.id, char),
        'name',
        U.name,
        'lastname',
        U.lastname,
        'image',
        U.image,
        'phone',
        U.phone
    ) AS client,
    JSON_OBJECT(
        'id',
        CONVERT(U2.id, char),
        'name',
        U2.name,
        'lastname',
        U2.lastname,
        'image',
        U2.image,
        'phone',
        U2.phone
    ) AS delivery,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id',
            CONVERT(P.id, char),
            'name',
            P.name,
            'description',
            P.description,
            'image1',
            P.image1,
            'image2',
            P.image2,
            'image3',
            P.image3,
            'price',
            P.price,
            'quantity',
            OHP.quantity
        )
    ) AS products
FROM
    orders AS O
    INNER JOIN users AS U ON U.id = O.id_client
    LEFT JOIN users AS U2 ON U2.id = O.id_delivery
    INNER JOIN address AS A ON A.id = O.id_address
    INNER JOIN order_has_products AS OHP ON OHP.id_order = O.id
    INNER JOIN products AS P ON P.id = OHP.id_product
WHERE
    status = ?
GROUP BY
    O.id
ORDER BY
    O.timestamp;

SELECT
    CONVERT(O.id, char) AS id,
    CONVERT(O.id_client, char) AS id_client,
    CONVERT(O.id_address, char) AS id_address,
    CONVERT(O.id_delivery, char) AS id_delivery,
    O.status,
    O.timestamp,
    O.lat,
    O.lng,
    JSON_OBJECT(
        'id',
        CONVERT(A.id, char),
        'address',
        A.address,
        'reference',
        A.reference,
        'lat',
        A.lat,
        'lng',
        A.lng
    ) AS address,
    JSON_OBJECT(
        'id',
        CONVERT(U.id, char),
        'name',
        U.name,
        'lastname',
        U.lastname,
        'image',
        U.image,
        'phone',
        U.phone
    ) AS client,
    JSON_OBJECT(
        'id',
        CONVERT(U2.id, char),
        'name',
        U2.name,
        'lastname',
        U2.lastname,
        'image',
        U2.image,
        'phone',
        U2.phone
    ) AS delivery,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id',
            CONVERT(P.id, char),
            'name',
            P.name,
            'description',
            P.description,
            'image1',
            P.image1,
            'image2',
            P.image2,
            'image3',
            P.image3,
            'price',
            P.price,
            'quantity',
            OHP.quantity
        )
    ) AS products
FROM
    orders AS O
    INNER JOIN users AS U ON U.id = O.id_client
    LEFT JOIN users AS U2 ON U2.id = O.id_delivery
    INNER JOIN address AS A ON A.id = O.id_address
    INNER JOIN order_has_products AS OHP ON OHP.id_order = O.id
    INNER JOIN products AS P ON P.id = OHP.id_product
WHERE
    O.id_delivery = ?
    AND O.status = ?
GROUP BY
    O.id
ORDER BY
    O.timestamp;

SELECT
    CONVERT(O.id, char) AS id,
    CONVERT(O.id_client, char) AS id_client,
    CONVERT(O.id_address, char) AS id_address,
    CONVERT(O.id_delivery, char) AS id_delivery,
    O.status,
    O.timestamp,
    O.lat,
    O.lng,
    JSON_OBJECT(
        'id',
        CONVERT(A.id, char),
        'address',
        A.address,
        'reference',
        A.reference,
        'lat',
        A.lat,
        'lng',
        A.lng
    ) AS address,
    JSON_OBJECT(
        'id',
        CONVERT(U.id, char),
        'name',
        U.name,
        'lastname',
        U.lastname,
        'image',
        U.image,
        'phone',
        U.phone
    ) AS client,
    JSON_OBJECT(
        'id',
        CONVERT(U2.id, char),
        'name',
        U2.name,
        'lastname',
        U2.lastname,
        'image',
        U2.image,
        'phone',
        U2.phone
    ) AS delivery,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id',
            CONVERT(P.id, char),
            'name',
            P.name,
            'description',
            P.description,
            'image1',
            P.image1,
            'image2',
            P.image2,
            'image3',
            P.image3,
            'price',
            P.price,
            'quantity',
            OHP.quantity
        )
    ) AS products
FROM
    orders AS O
    INNER JOIN users AS U ON U.id = O.id_client
    LEFT JOIN users AS U2 ON U2.id = O.id_delivery
    INNER JOIN address AS A ON A.id = O.id_address
    INNER JOIN order_has_products AS OHP ON OHP.id_order = O.id
    INNER JOIN products AS P ON P.id = OHP.id_product
WHERE
    O.id_client = ?
    AND O.status = ?
GROUP BY
    O.id
ORDER BY
    O.timestamp DESC;

INSERT INTO
    orders(
        id_client,
        id_address,
        status,
        timestamp,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?, ?);

UPDATE
    orders
SET
    id_delivery = ?,
    status = ?,
    updated_at = ?
WHERE
    id = ?;

UPDATE
    orders
SET
    status = ?,
    updated_at = ?
WHERE
    id = ?;

UPDATE
    orders
SET
    status = ?,
    updated_at = ?
WHERE
    id = ?;

UPDATE
    orders
SET
    lat = ?,
    lng = ?,
    updated_at = ?
WHERE
    id = ?;

/**********ORDER HAS PRODUCTS**********/
INSERT INTO
    order_has_products(
        id_order,
        id_product,
        quantity,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?);