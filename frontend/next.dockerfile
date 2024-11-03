# Etapa base para ejecutar Node.js
FROM node:18-alpine AS base

# Etapa de dependencias usando Bun
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lockb ./

# Instala las dependencias usando Bun
RUN bun install --frozen-lockfile

# Etapa de construcción usando Bun
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilita la telemetría de Next.js durante la construcción
ENV NEXT_TELEMETRY_DISABLED=1

# Construye la aplicación Next.js
RUN bun next build

# Etapa de ejecución con Node.js
FROM base AS runner
WORKDIR /app

# Define el entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Agrega un usuario no privilegiado para ejecutar el proceso
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ajusta permisos para la caché de prerenderizado
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Cambia al usuario creado
USER nextjs

# Expone el puerto 3000
EXPOSE 3000

# Define la dirección para la ejecución
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Ejecuta el servidor de Next.js en producción
CMD ["node", "server.js"]
