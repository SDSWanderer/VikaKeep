drop table if exists notes;

create table notes (
    id        INT       NOT NULL AUTO_INCREMENT,
    text      TEXT      NOT NULL,
    date      DATETIME  NOT NULL,
    isDeleted BOOLEAN   NOT NULL    DEFAULT FALSE,

    PRIMARY KEY (id)
);