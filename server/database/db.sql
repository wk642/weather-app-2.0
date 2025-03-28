-- create database

-- DROP the database first in case there's an existing one
DROP DATABASE IF EXISTS weatherappvtwo;

-- CREATE the database now
CREATE DATABASE weatherappvtwo;

-- connect to the database
\connect weatherappvtwo;

-- CREATE tables
-- weathercategories
CREATE TABLE IF NOT EXISTS weathercategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR,
    category_description text
);

-- users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR,
    favorite_city VARCHAR,
    weather_category_id UUID REFERENCES weathercategories(id)
);

-- Inserting minimum of 3 mock data
-- WEATHERCATEGORIES
INSERT INTO weathercategories (category_name, category_description) VALUES
('Clear Sky', 'Sky is clear, sun is out, enjoy your day.'),
('Few Clouds', 'There are a few clouds out there.'),
('Scattered Clouds', 'Now we got a couple more clouds up there. So if you want some shade, this is your chance!');

-- USERS
-- these users will have a null weather category id, because there is no logic to match the city to a category.
INSERT INTO users (user_name, favorite_city, weather_category_id) VALUES
('Winnie', 'Boston', null),
('John', 'Nashville', null),
('Jane', 'New York', null);