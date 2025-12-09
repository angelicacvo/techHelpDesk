# ================================
# Etapa 1: Build (Construcción)
# ================================
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# ================================
# Etapa 2: Production (Producción)
# ================================
FROM node:20-alpine AS production

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código compilado desde la etapa de build
COPY --from=builder /app/dist ./dist

# Exponer el puerto de la aplicación
EXPOSE 3004

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
