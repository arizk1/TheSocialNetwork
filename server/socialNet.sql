-- DROP  TABLE IF EXISTS users;
-- DROP  TABLE IF EXISTS reset_codes;
-- DROP  TABLE IF EXISTS friendships;


CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      profile_pic VARCHAR(255),
      bio VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
);

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL CHECK (message != ''),
    sender_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages(
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL CHECK (message != ''),
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO chat_messages (sender_id, message) VALUES ('4', 'Yes');
INSERT INTO chat_messages (sender_id, message) VALUES ('13', 'I can hear you');
INSERT INTO chat_messages (sender_id, message) VALUES ('20', 'Do you hear me!');
INSERT INTO chat_messages (sender_id, message) VALUES ('13', 'No');

INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('204','200', 'Hey!');
INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('200','204', 'How are you?');
INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('204','100', 'Hey!');
INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('100','204', 'Hello!');