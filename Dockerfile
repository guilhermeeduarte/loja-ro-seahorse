FROM maven:3.9.6-eclipse-temurin-17 AS backend-build

WORKDIR /app

COPY api/Amigurumi/pom.xml .
RUN mvn dependency:go-offline -B

COPY api/Amigurumi/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN mkdir -p /tmp/uploads/produtos

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]