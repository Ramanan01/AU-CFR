# syntax=docker/dockerfile:1.0

FROM golang:1.15-alpine

ENV GIN_MODE=release

WORKDIR /app
# COPY go.mod ./
# COPY go.sum ./

COPY . ./
RUN go mod download

RUN go build -o /docker-go-backend

EXPOSE 8080

CMD [ "/docker-go-backend" ]
