pragma foreign_keys=on;

create table IF NOT EXISTS users(id INTEGER PRIMARY KEY ASC AUTOINCREMENT,lastname Char(50), firstname char(50),birhtdate char(10), login CHAR(50) NOT NULL default 'login' unique, nickname CHAR(50) UNIQUE, state BOOLEAN NOT NULL CHECK (state IN (0,1)) default 1);

create table IF NOT EXISTS messages (id INTEGER PRIMARY KEY ASC AUTOINCREMENT, content Text NOT NULL, parent_message INTEGER, user_id INTEGER, topic CHAR(50) NOT NULL default "General", postdate Text default (datetime('now','localtime')), lastUpdate text default (datetime('now','localtime')), lastCommentdate text, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE , FOREIGN KEY(parent_message) REFERENCES messages(id) ON DELETE CASCADE );

insert into users(id, login, nickname) values (-1,'admin','administrator');

insert into messages(  content, topic, user_id )  values ('this is a text', 'this is a topic', -1);