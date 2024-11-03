FROM golang:1.23.2-alpine3.20

WORKDIR /app

RUN go install github.com/air-verse/air@latest

# Instala git
RUN apk add --no-cache git

COPY . .

# Download and install the dependencies
RUN go get -v ./...

# Build the Go app
# RUN go build -o github.com/nightmareVCO/user-crud-go-nextjs .

EXPOSE 8000

CMD ["air", "-c", ".air.toml"]  
# CMD ["./github.com/nightmareVCO/user-crud-go-nextjs"]