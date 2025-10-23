FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


COPY api/Amigurumi/pom.xml .
RUN mvn dependency:go-offline -B

COPY api/Amigurumi/src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html


COPY --from=build /app/target/*.jar app.jar


EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

ENTRYPOINT ["java", "-jar", "app.jar"]
