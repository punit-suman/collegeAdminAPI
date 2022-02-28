-- DROP DATABASE IF EXISTS schooladmin;

-- CREATE DATABASE schooladmin;

-- use database
-- \c schooladmin;

DROP TABLE students;

CREATE TABLE students(
    studentid SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT,
    gender VARCHAR(15) NOT NULL,
    dob TIMESTAMPTZ NOT NULL,
    address TEXT NOT NULL,
    phonenumber BIGINT NOT NULL CHECK (phonenumber > 999999999 and phonenumber <= 9999999999),
    addedon TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
    updatedon TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE
);