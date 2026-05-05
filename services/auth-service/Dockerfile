FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
COPY services/auth-service/pom.xml services/auth-service/pom.xml
COPY services/vehicle-service/pom.xml services/vehicle-service/pom.xml
COPY services/rental-service/pom.xml services/rental-service/pom.xml
COPY services/auth-service/src services/auth-service/src
RUN mvn -pl services/auth-service -am package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/services/auth-service/target/auth-service-0.1.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
