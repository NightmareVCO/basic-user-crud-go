package utils

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte(os.Getenv("JWT_SECRET"))

func GenerateJWT(profileID int) (string, error) {
	// Crear las claims del token, que incluyen el ID del perfil y la fecha de expiración

	profileIDBytes := []byte(fmt.Sprintf("%d", profileID))
	//encryp the profile id
	encryptedProfileID, err := Encrypt(profileIDBytes, os.Getenv("ENCRYPTION_KEY"))
	if err != nil {
		log.Fatal("Error al encriptar el ID:", err)
	}

	claims := jwt.MapClaims{
		"profile_id": encryptedProfileID,                    // Aquí guardamos el ID del perfil encriptado
		"exp":        time.Now().Add(time.Hour * 24).Unix(), // Expiración en 24 horas
		"iat":        time.Now().Unix(),                     // Añadir tiempo de emisión
	}

	// Crear el token con el método de firma HS256 y las claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar el token con la clave secreta
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Función para verificar y extraer el ID del perfil del token JWT
func ParseJWT(tokenString string) (int, error) {
	// Eliminar el prefijo "Bearer " si está presente
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Parsear y validar el token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validar que el método de firma sea el esperado
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		return 0, err
	}

	// Extraer y convertir las claims si la validación es exitosa
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		descryptedProfileID, err := DecryptJWTInfo(claims["profile_id"].(string), os.Getenv("ENCRYPTION_KEY"))
		if err != nil {
			return 0, err
		}

		return descryptedProfileID, nil
	}

	return 0, fmt.Errorf("token inválido")
}

func DecryptJWTInfo(ciphertext string, keyString string) (int, error) {
	decryptedProfileID, err := Decrypt(ciphertext, keyString)
	if err != nil {
		return 0, err
	}

	profileID, err := strconv.Atoi(string(decryptedProfileID))
	if err != nil {
		return 0, err
	}

	return profileID, nil
}
