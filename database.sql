create table IF NOT EXISTS messages (id int PRIMARY KEY ASC AUTOINCREMENT, message Text NOT NULL, parent_message INT, user_id INT NOT NULL)

create table IF NOT EXISTS users(id int PRIMARY KEY ASC AUTOINCREMENT, login CHAR(50) NOT NULL, email CHAR(50) UNIQUE,phoneNumber CHAR(50), pwd CHAR(50) )

insert into users values (-1,'admin','administrator')