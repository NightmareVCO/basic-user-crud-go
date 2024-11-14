# Stage 1: Hot Reload
FROM golang:1.23.2-alpine3.20 AS reload

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go mod tidy

EXPOSE 8000

CMD ["air", "-c", ".air.toml"]

# Stage 2: Debug
FROM golang:1.23.2-alpine3.20 AS debug

WORKDIR /app

RUN go install github.com/go-delve/delve/cmd/dlv@latest

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go mod tidy

EXPOSE 8000
EXPOSE 2345

CMD ["dlv", "debug", "--headless", "--listen=:2345", "--api-version=2", "--log"]