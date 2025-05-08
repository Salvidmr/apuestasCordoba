# Fase 1: Build con Maven y Java 17
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Fase 2: Imagen final con Java 17
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/apuestasCordoba-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
