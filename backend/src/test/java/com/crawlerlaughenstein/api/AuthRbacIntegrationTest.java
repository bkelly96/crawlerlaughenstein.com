package com.crawlerlaughenstein.api;

import com.crawlerlaughenstein.api.auth.dto.LoginRequest;
import com.crawlerlaughenstein.api.auth.dto.LoginResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthRbacIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void dmCanReachDmDashboardButNotPlayerDashboard() {
        String token = login("dm1", "ChangeMe123!DM").token();

        assertThat(get("/api/dashboard/dm", token).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(get("/api/dashboard/player", token).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void playerCanReachPlayerDashboardButNotDmDashboard() {
        String token = login("player1", "ChangeMe123!Player").token();

        assertThat(get("/api/dashboard/player", token).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(get("/api/dashboard/dm", token).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void badCredentialsReturns401() {
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                "/api/auth/login", new LoginRequest("dm1", "wrong-password"), LoginResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void unauthenticatedRequestReturns401() {
        assertThat(get("/api/dashboard/dm", null).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private LoginResponse login(String username, String password) {
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                "/api/auth/login", new LoginRequest(username, password), LoginResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        return response.getBody();
    }

    private ResponseEntity<String> get(String path, String token) {
        HttpHeaders headers = new HttpHeaders();
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return restTemplate.exchange(path, HttpMethod.GET, new HttpEntity<>(headers), String.class);
    }
}
