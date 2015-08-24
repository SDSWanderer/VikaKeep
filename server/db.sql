drop table if exists notes;
drop table if exists users;

create table users (
    email    VARCHAR(40)  NOT NULL,
    password VARCHAR(100) NOT NULL,
    salt     VARCHAR(40)  NOT NULL,
    name     VARCHAR(40)  NOT NULL,

    PRIMARY KEY (email)
);

create table notes (
    id        INT         NOT NULL AUTO_INCREMENT,
    text      TEXT        NOT NULL,
    date      DATETIME    NOT NULL,
    isDeleted BOOLEAN     NOT NULL DEFAULT FALSE,
    user      VARCHAR(40) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user) REFERENCES users (email)
);
