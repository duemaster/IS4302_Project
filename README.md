# IS4302_Project


## Set up Vagrant Environment
We have configured a special vagrant file inside our project folder

```bash
vagrant up
cd composer-playground
./playground.sh
./setup.sh
```

## Upgrade Network (optional)
If there is a need to update bna

```bash
./update-network.sh
```

## Things to check
1. Vagrant File and Docker.compose-cli.yaml have ports 15000+ opened
Vagrant
```
  # Airline
  for i in 15000..15019
    config.vm.network :forwarded_port, guest: i, host: i
  end

  # Cargo
  for i in 15020..15039
    config.vm.network :forwarded_port, guest: i, host: i
  end

  # Cargo 2
  for i in 15040..15059
    config.vm.network :forwarded_port, guest: i, host: i
  end

  # GHA
  for i in 15060..15079
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
      - "15000-15080:15000-15080"
```
2. air-chain.bna file is the latest version
3. Check both blockchain (localhost:8080) and mysql database have the same users that tally



## Setup Database
This project has 4 companies and 4 servers. Below is the sql command to create corresponding database.

1 Airline Company
```sql
CREATE DATABASE Airline DEFAULT CHARACTER SET utf8;
CREATE USER 'Airline'@'localhost' IDENTIFIED BY 'Airline';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON Airline.* TO 'Airline'@'localhost';
```

2 Cargo Company
```sql
CREATE DATABASE CargoCom DEFAULT CHARACTER SET utf8;
CREATE USER 'CargoCom'@'localhost' IDENTIFIED BY 'CargoCom';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON CargoCom.* TO 'CargoCom'@'localhost';
```

3 Cargo Company 2
```sql
CREATE DATABASE CargoCom2 DEFAULT CHARACTER SET utf8;
CREATE USER 'CargoCom2'@'localhost' IDENTIFIED BY 'CargoCom2';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON CargoCom2.* TO 'CargoCom2'@'localhost';
```

4 GHA Company
```sql
CREATE DATABASE GHA DEFAULT CHARACTER SET utf8;
CREATE USER 'GHA'@'localhost' IDENTIFIED BY 'GHA';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON GHA.* TO 'GHA'@'localhost';
```
## Set up server

### Install sbt (sbt is the engine to run server)
Please refer to the installing section in below link
       
       https://www.scala-sbt.org/1.0/docs/Setup.html

### Run server in a server folder

**Airline use 9000, GHA 9001, Cargo1 9002, Cargo2 9003**
    
    sbt
    run 9000
    
A default admin user(userName: admin, password:password) will be created.
Web app is already built in production and served by server.

## Set up mobile app
Each type of company has Server,App and Web. Server uses play framework, Web is a angular 5 project and app is ionic project.

For App please use npm install

```bash
npm install
```

## Start Ionic App (Inside App Directory)

### Option 1 use browser
Ionic allows to use browser to simulate the app, however native functions such as scan QR code is not available.
It is needed to disable chrome CORS security also since request is from port 4200 and sending request to port 9000.

Do **change Ip address** in app/src/providers/settings/settings.ts for each app
```bash
ionic serve
```

### Option 2 Install on android phone (ios needs other configuration)
Install on android phone and android development is required.
Do **change Ip address** in app/src/providers/settings/settings.ts for each app

    
    ionic cordova platform add android
    ionic cordova run android --Device


## Testing Blockchain
```bash
cd to hyper-ledger-composer-model
npm test
```

If any problem is appeared please contact us 