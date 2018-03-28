# Set up Vagrant

## Delete old .bna file in /mnt folder if exists
```
sudo rm <old .bna file>
```

## Shift new .bna into composer-playground folder

## Shift new .bna into /mnt folder using sudo
```
    sudo mv <.bna file> <new directory/.bna file>
```

## Down playground and up it again
```
    echo "y" | ./playground.sh down
    echo "y" | ./playground.sh
```

## Create CA
```
docker exec -it ca.org1.example.com fabric-ca-client enroll -M registrar -u http://admin:adminpw@localhost:7054;
```

## Create Admin
```
docker exec -it ca.org1.example.com fabric-ca-client register -M registrar -u http://localhost:7054 --id.name admin1 --id.affiliation org1 --id.attrs '"hf.Registrar.Roles=client"' --id.type user;
```

### Save the password

## Deploy Network
