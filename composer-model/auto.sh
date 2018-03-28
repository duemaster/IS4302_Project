#!/bin/bash 
# cd to composer-playground folder
# echo "y" | ./playground.sh down # clear playground

# echo "y" | ./playground.sh 

# Create CA
docker exec -it ca.org1.example.com fabric-ca-client enroll -M registrar -u http://admin:adminpw@localhost:7054;

# Register user
docker exec -it ca.org1.example.com fabric-ca-client register -M registrar -u http://localhost:7054 --id.name admin1 --id.affiliation org1 --id.attrs '"hf.Registrar.Roles=client"' --id.type user;

echo ${PASSWORD##*"Password: "} > myPassword.txt; 
PASSWORD=$(cat myPassword.txt);
PASSWORD=${PASSWORD//$'\n'/};
echo $PASSWORD;

docker exec cli composer network deploy --archiveFile /mnt/air-chain.bna -A admin1 -c PeerAdmin@hlfv1 -S XutccqwGRkRE;

docker exec cli composer card import -f admin1@air-chain.card;

docker exec cli composer-rest-server -c admin1@air-chain -p 4000;