create table if not exists "user"
(
    id            serial
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    email         varchar(320)             not null
        constraint "UQ_e12875dfb3b1d92d7d7c5377e22"
            unique,
    password      varchar(200)             not null,
    "phoneNumber" varchar(30)              not null default '',
    "timeCreated" timestamp with time zone not null,
    "timeSignOut" timestamp with time zone not null
);

create table if not exists subscription
(
    "eventId" integer not null,
    "userId"  integer not null
        constraint subscription_user_id_fk
            references "user"
            on delete cascade,
    constraint subscription_pk
        primary key ("eventId", "userId")
);

create table if not exists "chatRequest"
(
    "eventId" integer not null,
    "userId"  integer not null
        constraint chat_request_user_id_fk
            references "user"
            on delete cascade,
    constraint chat_request_pk
        primary key ("eventId", "userId")
);

alter table "user"
    owner to developer;

alter table subscription
    owner to developer;

alter table "chatRequest"
    owner to developer;
