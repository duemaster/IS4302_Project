 #!/bin/bash 
# Create CA
docker exec -it ca.org1.example.com fabric-ca-client enroll -M registrar -u http://admin:adminpw@localhost:7054;

# Register user
PASSWORD="$(docker exec -it ca.org1.example.com fabric-ca-client register -M registrar -u http://localhost:7054 --id.name admin1 --id.affiliation org1 --id.attrs '"hf.Registrar.Roles=client"' --id.type user)";
# PASSWORD="Password: vltlThfGkrKy";

# echo $PASSWORD;
PASSWORD=${PASSWORD##*"Password: "};

echo $PASSWORD;

# VQekeUScvLWi

docker exec cli composer network deploy --archiveFile /mnt/air-chain.bna -A admin1 -c PeerAdmin@hlfv1 -S $PASSWORD;

docker exec cli composer card import -f admin1@air-chain.card;

docker exec cli composer-rest-server -c admin1@air-chain -p 3000;

# Create Airline Company with id="Airline1"