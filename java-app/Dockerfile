FROM openjdk:11-jdk as build
WORKDIR /build
COPY . .
RUN ./mvnw clean package


FROM openjdk:11-jdk
COPY --from=build /build/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
