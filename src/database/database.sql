CREATE DATABASE vtubers;

CREATE TABLE vtuber(
    name VARCHAR(23) PRIMARY KEY,
    "vtuber_id" SERIAL,
    "platformLink" jsonb,
    "socialsLink" jsonb,
    "genre" text[],
    "model" jsonb,
    "groups" text[],
    "characterArt" VARCHAR(255),
    "cardArt" VARCHAR(255),
    "likes" jsonb
);

CREATE TABLE users(
    email VARCHAR(40) PRIMARY KEY,
    password VARCHAR(40) NOT NULL,
    likes jsonb
);

CREATE TABLE test(
    test_id serial primary key, -- this doesn't need to be caps!
    something text[]
);