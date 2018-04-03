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

## Install Node Dependencies (Inside Ionic Project Directory Or Angular Project Directory)
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

## Set up Vagrant Environment
```bash
vagrant up
cd composer-playground
./playground.sh
./setup.sh
```

## Things to check
1. Vagrant File and Docker.compose-cli.yaml have ports 20000+ opened
Vagrant
```
  # Airline
  for i in 20000..20009
    config.vm.network :forwarded_port, guest: i, host: i
  end

  # Cargo
  for i in 20010..20019
    config.vm.network :forwarded_port, guest: i, host: i
  end

  # GHA
  for i in 20020..20029
    config.vm.network :forwarded_port, guest: i, host: i
  end
```

Docker
```
    ports:
      - 8080:8080
      - 3000:3000
      - 3001:3001
      - 3002:3002
      - "20000-20100:20000-20100"
```
2. air-chain.bna file is the latest version
3. Check both blockchain (localhost:8080) and mysql database have the same number of users that tally