docker-compose -f docker-compose.test.yml up -d --build
docker attach backend_test

function finish {
  docker-compose -f docker-compose.test.yml down
}

trap finish EXIT
