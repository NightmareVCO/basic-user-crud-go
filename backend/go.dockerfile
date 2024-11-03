FROM golang:1.23.2-alpine3.20

WORKDIR /app

RUN go install github.com/air-verse/air@latest

# Instala git
COPY go.mod go.sum ./

# Descarga las dependencias
RUN go mod download

COPY . .

# Si hay dependencias que deben ser instaladas, puedes usar esto
RUN go mod tidy

# Build the Go app
# RUN go build -o api .

EXPOSE 8000

CMD ["air", "-c", ".air.toml"]  
# CMD ["./api"]