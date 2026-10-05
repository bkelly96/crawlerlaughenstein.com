package com.crawlerlaughenstein.api;

import com.crawlerlaughenstein.api.auth.dto.LoginRequest;
import com.crawlerlaughenstein.api.auth.dto.LoginResponse;
import com.crawlerlaughenstein.api.character.dto.CharacterResponse;
import com.crawlerlaughenstein.api.character.dto.CharacterSummary;
import com.crawlerlaughenstein.api.user.Role;
import com.crawlerlaughenstein.api.user.User;
import com.crawlerlaughenstein.api.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CharacterApiIntegrationTest {

    // Test-only password, set directly on the accounts below (see AuthRbacIntegrationTest).
    private static final String TEST_PASSWORD = "integration-test-password";

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUpAccounts() {
        setPassword("dm1");
        setPassword("player1");
        // A second player with no characters, to check cross-player access.
        if (userRepository.findByUsername("player2").isEmpty()) {
            userRepository.save(User.builder()
                    .username("player2")
                    .email("player2@example.com")
                    .passwordHash(passwordEncoder.encode(TEST_PASSWORD))
                    .role(Role.PLAYER)
                    .build());
        }
    }

    private void setPassword(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setPasswordHash(passwordEncoder.encode(TEST_PASSWORD));
        userRepository.save(user);
    }

    @Test
    void playerListsAndReadsOwnSeededCharacter() {
        String token = login("player1");

        List<CharacterSummary> characters = list(token);
        assertThat(characters).hasSize(1);

        ResponseEntity<CharacterResponse> response = exchange(
                HttpMethod.GET, "/api/characters/" + characters.get(0).id(), token, null, CharacterResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().body()).isNotNull();
        assertThat(response.getBody().body().abilities()).isNotNull();
    }

    @Test
    void playerCanUpdateOwnCharacterAndChangesPersist() {
        String token = login("player1");
        UUID id = list(token).get(0).id();
        Map<String, Object> character = getAsMap(id, token);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = new HashMap<>((Map<String, Object>) character.get("body"));
        body.put("notes", "Updated by integration test");
        long version = ((Number) character.get("version")).longValue();
        Map<String, Object> update = Map.of("name", character.get("name"), "level", 4, "body", body, "version", version);

        ResponseEntity<CharacterResponse> put = exchange(
                HttpMethod.PUT, "/api/characters/" + id, token, update, CharacterResponse.class);
        assertThat(put.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(put.getBody().version()).isEqualTo(version + 1);

        Map<String, Object> reloaded = getAsMap(id, token);
        assertThat(reloaded.get("level")).isEqualTo(4);
        assertThat(((Map<?, ?>) reloaded.get("body")).get("notes")).isEqualTo("Updated by integration test");
    }

    @Test
    void saveWithStaleVersionReturns409AndDoesNotOverwrite() {
        String token = login("player1");
        UUID id = list(token).get(0).id();
        Map<String, Object> loaded = getAsMap(id, token);

        // First save from this copy succeeds and bumps the version.
        Map<String, Object> first = new HashMap<>(loaded);
        first.put("name", "Saved First");
        assertThat(exchange(HttpMethod.PUT, "/api/characters/" + id, token, first, String.class).getStatusCode())
                .isEqualTo(HttpStatus.OK);

        // A second save based on the same (now stale) copy is rejected.
        Map<String, Object> second = new HashMap<>(loaded);
        second.put("name", "Saved Second");
        assertThat(exchange(HttpMethod.PUT, "/api/characters/" + id, token, second, String.class).getStatusCode())
                .isEqualTo(HttpStatus.CONFLICT);

        assertThat(getAsMap(id, token).get("name")).isEqualTo("Saved First");
    }

    @Test
    void invalidUpdateReturns400() {
        String token = login("player1");
        UUID id = list(token).get(0).id();
        Map<String, Object> character = getAsMap(id, token);
        Map<String, Object> update = Map.of(
                "name", "", "level", 0, "body", character.get("body"), "version", character.get("version"));

        assertThat(exchange(HttpMethod.PUT, "/api/characters/" + id, token, update, String.class).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void otherPlayerGets404ForReadAndUpdate() {
        UUID id = list(login("player1")).get(0).id();
        Map<String, Object> character = getAsMap(id, login("player1"));
        String otherToken = login("player2");

        assertThat(list(otherToken)).isEmpty();
        assertThat(exchange(HttpMethod.GET, "/api/characters/" + id, otherToken, null, String.class).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(exchange(HttpMethod.PUT, "/api/characters/" + id, otherToken, character, String.class).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void dmCanListAndReadAnyCharacterButNotUpdate() {
        UUID id = list(login("player1")).get(0).id();
        String dmToken = login("dm1");

        assertThat(list(dmToken)).extracting(CharacterSummary::id).contains(id);
        Map<String, Object> character = getAsMap(id, dmToken);
        assertThat(exchange(HttpMethod.PUT, "/api/characters/" + id, dmToken, character, String.class).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void unauthenticatedRequestReturns401() {
        assertThat(exchange(HttpMethod.GET, "/api/characters", null, null, String.class).getStatusCode())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private String login(String username) {
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                "/api/auth/login", new LoginRequest(username, TEST_PASSWORD), LoginResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        return response.getBody().token();
    }

    private List<CharacterSummary> list(String token) {
        ResponseEntity<List<CharacterSummary>> response = restTemplate.exchange(
                "/api/characters", HttpMethod.GET, new HttpEntity<>(headers(token)),
                new ParameterizedTypeReference<>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        return response.getBody();
    }

    private Map<String, Object> getAsMap(UUID id, String token) {
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                "/api/characters/" + id, HttpMethod.GET, new HttpEntity<>(headers(token)),
                new ParameterizedTypeReference<>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        return response.getBody();
    }

    private <T> ResponseEntity<T> exchange(HttpMethod method, String path, String token, Object body, Class<T> type) {
        return restTemplate.exchange(path, method, new HttpEntity<>(body, headers(token)), type);
    }

    private HttpHeaders headers(String token) {
        HttpHeaders headers = new HttpHeaders();
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return headers;
    }
}
