create database nodejs-blog;

--psql -U postgres

create table public.posts
(
    post_id SERIAL,
    post_title VARCHAR(100),
    post_content VARCHAR(2500),
    post_author VARCHAR(30),
    PRIMARY KEY (post_id)
)


CREATE TABLE public.users
(
    user_id serial,
    user_password character varying(250),
    user_name character varying(50),
    PRIMARY KEY (user_id)
);


create table public.tests
(
    test_id SERIAL,
    test_title VARCHAR(100),
    test_content VARCHAR(2500),
    test_author VARCHAR(30),
    PRIMARY KEY (tests_id)
);


insert into posts(post_id, post_title, post_content, post_author) 
values(1, 'post 1', ' continut 1 ... ', 'alin')


--heroku pg:psql