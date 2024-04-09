-- lentele(skelbimai)
CREATE TABLE skelbimai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    main_image_url VARCHAR(255) NOT NULL,
    images_1 VARCHAR(255),
    images_2 VARCHAR(255),
    images_3 VARCHAR(255),
    images_4 VARCHAR(255),
    images_5 VARCHAR(255),
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    phone VARCHAR(20),
    type ENUM('sell', 'buy', 'rent'), 
    town_id INT NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   is_published BOOLEAN DEFAULT 1

);

INSERT INTO skelbimai (title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published)
VALUES
('Parduodu automobilį', 'https://example.com/car.jpg', 'Labai geras automobilis, naujos padangos', 15000.00, '+37012345678', 'sell', 1, 1, 1, TRUE),
('Parduodu butą', 'https://example.com/apartment.jpg', 'Šviežiai suremontuotas butas miesto centre', 85000.00, '+37065432109', 'sell', 2, 2, 2, TRUE),
('Ieškau kambario', 'https://example.com/room.jpg', 'Ieškau kambario nuomai šeimai su vaikais', 300.00, '+37061234567', 'rent', 3, 1, 3, TRUE),
('Parduodu knygas', 'https://example.com/books.jpg', 'Daugiau nei 100 knygų įvairiomis temomis', 100.00, '+37098765432', 'sell', 4, 2, 4, FALSE),
('Parduodu telefoną', 'https://example.com/phone.jpg', 'Naujas išpakuotas telefono modelis', 500.00, '+37074185296', 'sell', 5, 1, 5, FALSE),
('Nuomoju butą', 'https://example.com/apartment2.jpg', 'Šviesus butas su visais patogumais', 700.00, '+37051234567', 'rent', 1, 2, 2, TRUE),
('Parduodu dviratį', 'https://example.com/bike.jpg', 'Greitas ir patvarus dviratis', 200.00, '+37067890123', 'sell', 2, 2, 5, FALSE),
('Ieškau kambario draugėms', 'https://example.com/roommates.jpg', 'Kambarių ieškojimas studentėms', 150.00, '+37011122334', 'rent', 3, 1, 3, FALSE),
('Parduodu baldus', 'https://example.com/furniture.jpg', 'Įvairių rūšių baldai', 300.00, '+37055566777', 'sell', 4, 2, 4, TRUE),
('Parduodu kompiuterį', 'https://example.com/computer.jpg', 'Naujas stacionarus kompiuteris', 1000.00, '+37099988877', 'sell', 5, 1, 5, TRUE),
('Ieškau automobilio', 'https://example.com/car_wanted.jpg', 'Ieškau naudoto automobilio', 10000.00, '+37098765432', 'buy', 1, 1, 1, TRUE),
('Ieškau buto', 'https://example.com/apartment_wanted.jpg', 'Ieškau buto įsigyti', 80000.00, '+37065432109', 'buy', 2, 2, 2, FALSE);





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

--lenteliu jungimas 
SELECT 
    skelbimai.id AS skelbimo_id, 
    vartotojai.id AS vartotojo_id, 
    miestai.id AS miesto_id, 
    kategorijos.id AS kategorijos_id 
FROM 
    skelbimai 
LEFT JOIN 
    vartotojai ON skelbimai.user_id = vartotojai.id 
LEFT JOIN 
    miestai ON skelbimai.town_id = miestai.id 
LEFT JOIN 
    kategorijos ON skelbimai.category_id = kategorijos.id;




