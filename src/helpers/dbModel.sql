-- lentele(skelbimai)
CREATE TABLE skelbimai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    main_image_url VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    phone VARCHAR(20),
    type ENUM('sell', 'buy', 'rent'), 
    town_id INT NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN NOT NULL DEFAULT FALSE 
);


INSERT INTO skelbimai (title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published) VALUES
('Parduodu automobilį', 'https://example.com/car.jpg', 'Labai geras automobilis, naujos padangos', 15000.00, '+37012345678', 'sell', 1, 1, 1, true),
('Parduodu butą', 'https://example.com/apartment.jpg', 'Šviežiai suremontuotas butas miesto centre', 85000.00, '+37065432109', 'sell', 2, 2, 2, true),
('Ieškau kambario', 'https://example.com/room.jpg', 'Ieškau kambario nuomai šeimai su vaikais', 300.00, '+37061234567', 'rent', 3, 1, 3, true),
('Parduodu knygas', 'https://example.com/books.jpg', 'Daugiau nei 100 knygų įvairiomis temomis', 100.00, '+37098765432', 'sell', 4, 2, 4, true),
('Parduodu telefoną', 'https://example.com/phone.jpg', 'Naujas išpakuotas telefono modelis', 500.00, '+37074185296', 'sell', 5, 1, 5, true);




-- lentele(miestai)

CREATE TABLE miestai (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  population INT,
  area DECIMAL(10, 2) 
);

INSERT INTO miestai (name, population, area) VALUES
('Vilnius', 587581, 401.02),
('Kaunas', 288122, 157.36),
('Klaipėda', 147396, 110.84),
('Šiauliai', 102878, 81.01),
('Panevėžys', 91222, 50.33);


--lentele(vartotojai)

CREATE TABLE vartotojai (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vartotojai (name, email, password, avatar_url) VALUES
('John Doe', 'john@example.com', '123456', 'https://example.com/avatar1.jpg'),
('Jane Smith', 'jane@example.com', '123456', 'https://example.com/avatar2.jpg');


--lentele(Kateogrijos)

CREATE TABLE kategorijos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);

INSERT INTO kategorijos (name) VALUES
('Nekilnojamas turtas'),
('Automobiliai'),
('Elektronika'),
('Drabužiai'),
('Buitinė technika');




