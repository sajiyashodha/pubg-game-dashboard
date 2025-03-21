docker exec -i tournament-db mysql -uroot -prootpassword tournamentdb < ./db-init/init.sql


docker-compose down --volumes --remove-orphans
docker-compose up --build

