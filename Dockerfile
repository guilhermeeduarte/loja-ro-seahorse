FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia o pom.xml e baixa dependências (cache mais eficiente)
COPY api/Amigurumi/pom.xml .
RUN mvn dependency:go-offline -B

COPY api/Amigurumi/src ./src
RUN mvn clean package -DskipTests

# Etapa 2: imagem final, mais leve, só com o .jar pronto
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copia o JAR da etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta configurada (3000 no seu caso)
EXPOSE 3000

# Comando de execução
ENTRYPOINT ["java", "-jar", "app.jar"]
