create database nodejsblog;

--psql -U postgres

create table public.posts
(
    post_id SERIAL,
    post_title VARCHAR(100),
    post_content VARCHAR(2500),
    post_author VARCHAR(30),
    PRIMARY KEY (post_id)
)

create table public.posts(post_id SERIAL,post_title VARCHAR(100),post_content VARCHAR(2500),post_author VARCHAR(30),PRIMARY KEY (post_id))

CREATE TABLE public.users
(
    user_id serial,
    user_password character varying(250),
    user_name character varying(50),
    user_email character varying1(50),
    PRIMARY KEY (user_id)
);

CREATE TABLE public.users(user_id serial,user_password character varying(250),user_name character varying(50),user_email character varying(50),PRIMARY KEY (user_id));

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

CREATE TABLE "user_sessions" (  "sid" varchar NOT NULL COLLATE "default",	"sess" json NOT NULL,	"expire" timestamp(6) NOT NULL)WITH (OIDS=FALSE);

ALTER TABLE "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");


insert into posts(post_id, post_title, post_content, post_author) values(1, 'post 1', ' continut 1 ... ', 'alin')

insert into users(post_id, post_title, post_content, post_author) values(1, 'post 1', ' continut 1 ... ', 'alin')

--heroku pg:psql