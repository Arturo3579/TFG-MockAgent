package com.example.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BackendApplicationTests {

	@Autowired
	private TestRestTemplate restTemplate;

	private String authToken;
	private static final String TEST_EMAIL = "test@mockagent.com";
	private static final String TEST_PASSWORD = "TestPass123!";

	@BeforeEach
	void setUp() {
		// Registrar usuario de prueba
		ResponseEntity<Map> signupResponse = restTemplate.postForEntity(
				"/api/auth/signup",
				Map.of("email", TEST_EMAIL, "password", TEST_PASSWORD),
				Map.class
		);

		if (signupResponse.getStatusCode() == HttpStatus.CREATED) {
			authToken = (String) signupResponse.getBody().get("token");
		} else {
			// Si ya existe, hacer login
			ResponseEntity<Map> loginResponse = restTemplate.postForEntity(
					"/api/auth/login",
					Map.of("email", TEST_EMAIL, "password", TEST_PASSWORD),
					Map.class
			);
			authToken = (String) loginResponse.getBody().get("token");
		}
	}

	@Test
	void contextLoads() {
		assertThat(restTemplate).isNotNull();
	}

	@Test
	void testSignupNewUser() {
		String uniqueEmail = "newuser" + System.currentTimeMillis() + "@mockagent.com";
		ResponseEntity<Map> response = restTemplate.postForEntity(
				"/api/auth/signup",
				Map.of("email", uniqueEmail, "password", "password123"),
				Map.class
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		assertThat(response.getBody()).containsKey("token");
		assertThat(response.getBody()).containsKey("email");
		assertThat(response.getBody().get("plan")).isEqualTo("starter");
	}

	@Test
	void testSignupDuplicateEmail() {
		ResponseEntity<Map> response = restTemplate.postForEntity(
				"/api/auth/signup",
				Map.of("email", TEST_EMAIL, "password", TEST_PASSWORD),
				Map.class
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody().get("message")).asString().contains("registrado");
	}

	@Test
	void testLoginSuccess() {
		ResponseEntity<Map> response = restTemplate.postForEntity(
				"/api/auth/login",
				Map.of("email", TEST_EMAIL, "password", TEST_PASSWORD),
				Map.class
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).containsKey("token");
		assertThat(response.getBody().get("email")).isEqualTo(TEST_EMAIL);
	}

	@Test
	void testLoginInvalidCredentials() {
		ResponseEntity<Map> response = restTemplate.postForEntity(
				"/api/auth/login",
				Map.of("email", TEST_EMAIL, "password", "wrongpassword"),
				Map.class
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void testCreateEndpoint() {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(authToken);
		HttpEntity<Map<String, Object>> request = new HttpEntity<>(
				Map.of("path", "/api/test", "method", "GET", "status", 200, "responseBody", "{\"msg\":\"ok\"}"),
				headers
		);

		ResponseEntity<Map> response = restTemplate.postForEntity("/admin/endpoints", request, Map.class);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		assertThat(response.getBody().get("path")).isEqualTo("/api/test");
		assertThat(response.getBody().get("method")).isEqualTo("GET");
		assertThat(response.getBody().get("status")).isEqualTo(200);
	}

	@Test
	void testListEndpoints() {
		// Primero creamos un endpoint
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(authToken);
		HttpEntity<Map<String, Object>> createRequest = new HttpEntity<>(
				Map.of("path", "/api/list-test", "method", "POST", "status", 201, "responseBody", "{}"),
				headers
		);
		restTemplate.postForEntity("/admin/endpoints", createRequest, Map.class);

		// Luego listamos
		HttpEntity<Void> listRequest = new HttpEntity<>(headers);
		ResponseEntity<List> response = restTemplate.exchange("/admin/endpoints", HttpMethod.GET, listRequest, List.class);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotEmpty();
	}

	@Test
	void testEndpointStarterLimit() {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(authToken);

		// Crear 5 endpoints (límite del plan starter)
		for (int i = 1; i <= 5; i++) {
			HttpEntity<Map<String, Object>> request = new HttpEntity<>(
					Map.of("path", "/api/limit" + i, "method", "GET", "status", 200, "responseBody", "{}"),
					headers
			);
			restTemplate.postForEntity("/admin/endpoints", request, Map.class);
		}

		// El 6º debería fallar con 403
		HttpEntity<Map<String, Object>> sixthRequest = new HttpEntity<>(
				Map.of("path", "/api/limit6", "method", "GET", "status", 200, "responseBody", "{}"),
				headers
		);
		ResponseEntity<Map> response = restTemplate.postForEntity("/admin/endpoints", sixthRequest, Map.class);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
		assertThat(response.getBody().get("message")).asString().containsIgnoringCase("límite");
	}

	@Test
	void testDeleteEndpoint() {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(authToken);

		// Crear
		HttpEntity<Map<String, Object>> createRequest = new HttpEntity<>(
				Map.of("path", "/api/to-delete", "method", "DELETE", "status", 204, "responseBody", "{}"),
				headers
		);
		ResponseEntity<Map> createResponse = restTemplate.postForEntity("/admin/endpoints", createRequest, Map.class);
		Integer id = (Integer) createResponse.getBody().get("id");

		// Eliminar
		HttpEntity<Void> deleteRequest = new HttpEntity<>(headers);
		ResponseEntity<Map> deleteResponse = restTemplate.exchange(
				"/admin/endpoints/" + id, HttpMethod.DELETE, deleteRequest, Map.class
		);

		assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(deleteResponse.getBody().get("message")).isEqualTo("Endpoint eliminado");
	}

	@Test
	void testMockResponse() {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(authToken);

		// Crear endpoint mock
		HttpEntity<Map<String, Object>> createRequest = new HttpEntity<>(
				Map.of("path", "/mock-test", "method", "GET", "status", 418, "responseBody", "{\"tea\":\"time\"}"),
				headers
		);
		restTemplate.postForEntity("/admin/endpoints", createRequest, Map.class);

		// Llamar al mock (no requiere auth)
		ResponseEntity<String> response = restTemplate.getForEntity("/mock/mock-test", String.class);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.I_AM_A_TEAPOT); // 418
		assertThat(response.getBody()).contains("tea");
	}
}
