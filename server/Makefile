
IMAGE_NAME=tez-server
CONTAINER_NAME=tez-server
DOCKER_PORT=4000

all: stop clean rm build run

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run --name $(CONTAINER_NAME) -p $(DOCKER_PORT):$(DOCKER_PORT) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)

rm:
	docker rm $(CONTAINER_NAME)

clean: stop rm
	docker rmi $(IMAGE_NAME) || true

help:
	@echo "Makefile commands:"
	@echo "  build     - Build the Docker image"
	@echo "  run       - Run the Docker container"
	@echo "  stop      - Stop the running container"
	@echo "  rm        - Remove the container"
	@echo "  clean     - Stop and remove the container, and clean up images"
	@echo "  help      - Display this help message"
