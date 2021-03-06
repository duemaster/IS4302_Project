# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table log (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  description                   varchar(255),
  level                         varchar(255),
  time                          datetime(6) not null,
  constraint pk_log primary key (id)
);

create table settings (
  id                            varchar(255) not null,
  value                         varchar(255),
  constraint pk_settings primary key (id)
);

create table user (
  id                            bigint not null,
  name                          varchar(255),
  password                      varchar(255),
  role                          varchar(255),
  process_id                    varchar(255),
  time_stamp                    datetime(6) not null,
  constraint uq_user_name unique (name),
  constraint pk_user primary key (id)
);


# --- !Downs

drop table if exists log;

drop table if exists settings;

drop table if exists user;

