create table if not exists "user"
(
    id                  serial
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    email               varchar(320)             not null
        constraint "UQ_e12875dfb3b1d92d7d7c5377e22"
            unique,
    password            varchar(200)             not null,
    "phoneNumber"       varchar(30)              not null default '',
    "createdAt"         timestamp with time zone not null,
    "updatedPasswordAt" timestamp with time zone not null
);

alter table "user"
    owner to developer;
