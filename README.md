# IS4302_Project

## Setup Database
```sql
CREATE DATABASE airChain DEFAULT CHARACTER SET utf8;
CREATE USER 'airChain'@'localhost' IDENTIFIED BY 'airChain';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON airChain.* TO 'airChain'@'localhost';
```

## Install Node Dependencies (Inside Ionic Project Directory)
```bash
npm install
```


## Start Ionic App (Inside Ionic Project Directory)
```bash
ionic serve
```

## Start Angular App 
```bash
ng serve --o
```