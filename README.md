# IS4302_Project

## Setup Database

1. Airline Company
```sql
CREATE DATABASE Airline DEFAULT CHARACTER SET utf8;
CREATE USER 'Airline'@'localhost' IDENTIFIED BY 'Airline';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON Airline.* TO 'Airline'@'localhost';
```

2. Cargo Company
```sql
CREATE DATABASE CargoCom DEFAULT CHARACTER SET utf8;
CREATE USER 'CargoCom'@'localhost' IDENTIFIED BY 'CargoCom';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON CargoCom.* TO 'CargoCom'@'localhost';
```

3. GHA Company
```sql
CREATE DATABASE GHA DEFAULT CHARACTER SET utf8;
CREATE USER 'GHA'@'localhost' IDENTIFIED BY 'GHA';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON GHA.* TO 'GHA'@'localhost';
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
ng serve -o
```