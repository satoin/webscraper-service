PWD := $(CURDIR)
PROJECT_NAME = $(notdir $(PWD))

DOCKERFILE := build/Dockerfile
DOCKER_IMAGE := $(PROJECT_NAME)_image
DOCKER_CONTAINER := $(PROJECT_NAME)_container

export PWD
export DOCKERFILE
export DOCKER_IMAGE
export DOCKER_CONTAINER

all:
	-docker rm -f $(DOCKER_CONTAINER)
	-docker rmi -f $(DOCKER_IMAGE)
	
	docker build -t $(DOCKER_IMAGE) -f $(DOCKERFILE) $(PWD)
	docker run --cap-add=SYS_ADMIN -p 8082:8080 --name=$(DOCKER_CONTAINER) $(DOCKER_IMAGE)

install:
	npm install

build: 
	docker build -t $(DOCKER_IMAGE) -f $(DOCKERFILE) .

run:
	docker run --cap-add=SYS_ADMIN -p 8082:8080 --name=$(DOCKER_CONTAINER) $(DOCKER_IMAGE)

enter:
	-docker exec -it $(DOCKER_CONTAINER) sh

stop:
	-docker stop $(DOCKER_CONTAINER)
	-docker rm -f $(DOCKER_CONTAINER)

clean:
	-docker rm -f $(DOCKER_CONTAINER)
	-docker rmi -f $(DOCKER_IMAGE)