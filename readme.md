### Backend

Backend dalis bus kuriama naudojant Express.js, Mysql.

1. Sukurti duomenu bazes lenteles
2. Sukurti JSON REST API
3. Sukurti CRUD operacijas

## Duomenu bazes lenteles

1. Skelbimai

id
title
main_image_url
description
price
phone
type (sell, buy, rent)
town_id
user_id
category_id
created_at
is_published

2. Miestai

id
name
population
area

3. Vartotojai

id
name
email
password
avatar_url
created_at

4. Kateogrijos

id
name

5. Sukure lenteles i miestu ir kategoriju lenteles irasykite bent po 5 irasus. Tai padare sukurkite bent bent 2 vartotojus ir 5 skelbimus.

## JSON REST API

### Skelbimu Routes

1. GET /api/ads - grazina visus skelbimus
2. GET /api/ads/:id - grazina viena skelbima
3. POST /api/ads - sukuria nauja skelbima
   DELETE /api/ads/:id - istrina skelbima (is_published = false)
   Autentifikacijos Routes
   POST /api/auth/register - registruoja nauja vartotoja
   POST /api/auth/login - prisijungia vartotoja Slaptazodziai turetu buti saugomi hashuotu formatu. Brcypt arba kitu biblioteku pagalba.
   PUT /api/auth/user/:id - atnaujina vartotojo informacija
   Miestu Routes
   GET /api/towns - grazina visus miestus
   GET /api/towns/:id - grazina viena miesta
   POST /api/towns - sukuria nauja miesta
   DELETE /api/towns/:id - istrina miesta
   Kategoriju Routes
   GET /api/categories - grazina visus kategorijas
   404 Routes
   Bet koks kitas route turetu grazinti 404 statusa json formatu.

Middleware
Post, Put requestu validacijai sukurkite middleware. Tikriname ar visi laukai yra uzpildyti ir ar jie atitinka reikalavimus. Jei nepavyks su middleware, galite naudoti paprasta if salyga.
