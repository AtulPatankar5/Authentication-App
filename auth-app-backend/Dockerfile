# =========================
# Stage 1: Build
# =========================
FROM maven:3.9.11-eclipse-temurin-25 AS build

WORKDIR /app

# Copy pom first for better Docker layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the Spring Boot JAR
RUN mvn clean package -DskipTests


# =========================
# Stage 2: Run
# =========================
FROM eclipse-temurin:25-jre

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]