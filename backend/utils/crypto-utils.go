package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"io"
)

func Encrypt(plaintext []byte, keyString string) (string, error) {
	key, _ := hex.DecodeString(keyString)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	iv := ciphertext[:aes.BlockSize]
	if _, err = io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

	return hex.EncodeToString(ciphertext), nil
}

func Decrypt(ciphertext string, keyString string) ([]byte, error) {
	key, _ := hex.DecodeString(keyString)
	ciphertextBytes, _ := hex.DecodeString(ciphertext)

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	if len(ciphertextBytes) < aes.BlockSize {
		return nil, errors.New("ciphertext too short")
	}

	iv := ciphertextBytes[:aes.BlockSize]
	ciphertextBytes = ciphertextBytes[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertextBytes, ciphertextBytes)

	return ciphertextBytes, nil
}
