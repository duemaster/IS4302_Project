## Set up Composer Environment

### 1. Start Playground Environment
`
./playground.sh
`

### 2. Create CA
`
docker exec -it ca.org1.example.com fabric-ca-client enroll -M registrar -u http://admin:adminpw@localhost:7054
`

## Handling BNA files

### Create BNA file
`
composer archive create -a lab4.bna -t dir -n .
`

### Unzip BNA file
`
unzip ${BNA file name.bna}
`


## CA Operations
### Register User
```
docker exec -it ca.org1.example.com fabric-ca-client register -M registrar -u http://localhost:7054 --id.name ${user_id} --id.affiliation org1 --id.attrs '"hf.Registrar.Roles=client"' --id.type user
```

Copy down the password issued by the system

### Enter Docker CLI Container Instance
```
docker exec -it cli bash
```

### Create User Card
```
composer network deploy --archiveFile /mnt/lab4.bna -A ${user_id} -c PeerAdmin@hlfv1 -S ${issued_password}
```

### Import User Card
```
composer card import -f ${card_file_name}
```


### Update deployed BNA Instance
```
composer network update --archiveFile /mnt/lab4.bna -c ${card_file_name}
```

### Launch Restful Server
```
composer-rest-server -c ${card_file_name (without .card extension)}
```


## Useful Docker Commands

### List All docker containers
```
docker ps
```

### Kill/Remove docker containers
```
docker kill/remove ${container_id}
```

### Kill/Remove all Docker container
```
docker ps -a -q | xargs docker rm -f
```

### Check docker logs
```
docker logs ${container name/id}
```