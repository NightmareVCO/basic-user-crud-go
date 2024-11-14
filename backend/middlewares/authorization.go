package middlewares

import (
	"api/utils"
	"context"
	"net/http"
)

type contextKey string

const AuthorizationKey contextKey = "Authorization"

func AuthorizationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userAccessToken := r.Header.Get("Authorization")
		ctx := context.WithValue(r.Context(), AuthorizationKey, userAccessToken)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func BeforeAuthorizationMiddlware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userAccessTokenJwt, ok := r.Context().Value(AuthorizationKey).(string)
		if !ok || userAccessTokenJwt == "" {
			http.Error(w, "Authorization token not found", http.StatusUnauthorized)
			return
		}

		profileID, err := utils.ParseJWT(userAccessTokenJwt)
		if err != nil {
			http.Error(w, "Error al obtener el ID del perfil", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "profileID", profileID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
