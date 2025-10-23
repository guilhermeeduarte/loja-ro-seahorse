FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY api/Amigurumi/src/main/resources/static/package*.json ./

RUN npm ci


COPY api/Amigurumi/src/main/resources/static/ ./

RUN chmod +x node_modules/.bin/vite
RUN npm run build

FROM maven:3.9.6-eclipse-temurin-17 AS backend-build

WORKDIR /app

COPY api/Amigurumi/pom.xml .
RUN mvn dependency:go-offline -B

COPY api/Amigurumi/src ./src

COPY --from=frontend-build /app/dist ./src/main/resources/static/dist

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]