# MockAgent.AI

> Infraestructura de mocking para equipos modernos. Crea entornos simulados de APIs en segundos, simula respuestas JSON y escala el desarrollo de agentes de IA sin depender de servidores externos.

---

## 🏗️ Arquitectura

```
┌─────────────────┐      HTTP/REST       ┌─────────────────────────┐
│   React 19      │ ◄──────────────────► │   Spring Boot 3.5       │
│   (Vite)        │   CORS: localhost    │   Port: 9090            │
│   Port: 5173    │                      │                         │
└─────────────────┘                      │  ┌───────────────────┐  │
                                         │  │ Spring Security │  │
                                         │  │ JWT Auth Filter │  │
                                         │  └────────┬──────────┘  │
                                         │           │             │
                                         │  ┌────────▼──────────┐  │
                                         │  │ Controllers       │  │
                                         │  │ - AuthController  │  │
                                         │  │ - EndpointCtrl    │  │
                                         │  │ - MockController  │  │
                                         │  │ - UserController  │  │
                                         │  └────────┬──────────┘  │
                                         │           │             │
                                         │  ┌────────▼──────────┐  │
                                         │  │ Services          │  │
                                         │  │ - AuthService     │  │
                                         │  │ - EndpointService │  │
                                         │  └────────┬──────────┘  │
                                         │           │             │
                                         │  ┌────────▼──────────┐  │
                                         │  │ Repositories      │  │
                                         │  │ (Spring Data JPA) │  │
                                         │  └────────┬──────────┘  │
                                         │           │             │
                                         │  ┌────────▼──────────┐  │
                                         │  │ MySQL 8.0         │  │
                                         │  │ Database: mockagent│  │
                                         │  └───────────────────┘  │
                                         └─────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Java 17** + **Spring Boot 3.5.14**
- **Spring Security** + **JWT** (jjwt 0.12.6)
- **Spring Data JPA** + **Hibernate 6**
- **MySQL 8.0** (driver: mysql-connector-j)
- **Lombok** (reducción de boilerplate)
- **Maven** (gestión de dependencias)

### Frontend
- **React 19**
- **Vite 8** (bundler y dev server)
- **TailwindCSS 4** (estilos utilitarios)
- **Framer Motion** (animaciones)
- **Lucide React** (iconografía)
- **Axios** (cliente HTTP)

### Infraestructura
- **MySQL** (persistencia relacional)
- **Tomcat 10** (embebido en Spring Boot)

---

## 🚀 Cómo arrancar el proyecto

### 1. Requisitos previos
- **Java 17** (JDK)
- **Node.js 20+** y **npm**
- **MySQL 8.0** corriendo en `localhost:3306`
- Crear la base de datos `mockagent` (Hibernate la creará automáticamente si no existe)

### 2. Configurar credenciales de MySQL
Edita `backend/backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=TU_USUARIO_MYSQL
spring.datasource.password=TU_CONTRASEÑA_MYSQL
```

### 3. Arrancar el Backend

```bash
cd backend/backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

O si necesitas compilar primero:

```bash
cd backend/backend
.\mvnw.cmd clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

El backend estará disponible en: `http://localhost:9090`

### 4. Arrancar el Frontend

```bash
cd frontend
npm install   # solo la primera vez
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
TFG_MockAgent/
├── backend/
│   └── backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/example/backend/
│       │   │   │   ├── BackendApplication.java
│       │   │   │   ├── config/          # SecurityConfig, CORS
│       │   │   │   ├── controller/      # REST Controllers
│       │   │   │   ├── dto/             # Data Transfer Objects
│       │   │   │   ├── model/           # Entidades JPA
│       │   │   │   ├── repository/        # Spring Data Repositories
│       │   │   │   ├── security/        # JWT Filter + Util
│       │   │   │   └── service/         # Lógica de negocio
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       │       └── java/com/example/backend/
│       │           └── BackendApplicationTests.java
│       ├── pom.xml
│       └── mvnw / mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Aplicación principal
│   │   ├── App.css          # Estilos globales y tema
│   │   ├── main.jsx         # Punto de entrada
│   │   └── assets/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 Autenticación y Autorización

El sistema utiliza **JSON Web Tokens (JWT)** para autenticación stateless.

1. El usuario se registra o loguea vía `/api/auth/signup` o `/api/auth/login`.
2. El backend devuelve un token JWT firmado.
3. El frontend almacena el token en `localStorage`.
4. En cada petición a endpoints protegidos (`/admin/**`), el frontend envía el token en el header `Authorization: Bearer <token>`.
5. El `JwtAuthFilter` valida el token y establece el contexto de seguridad.

### Roles y planes
- **STARTER** (gratis): hasta 5 endpoints activos.
- **PRO** (29€/mes): endpoints ilimitados + logs 30 días.
- **ENTERPRISE** (custom): SSO, RBAC, on-premise, SLA 99.99%.

---

## 🎯 Funcionalidades principales

| Módulo | Descripción |
|--------|-------------|
| **Landing** | Página de marketing con planes de precios, estadísticas y CTA. |
| **Auth** | Registro e inicio de sesión con JWT. |
| **Dashboard** | CRUD completo de endpoints mock (crear, editar, eliminar, listar, buscar). |
| **Mock Engine** | Servidor `/mock/**` que responde con el JSON configurado. |
| **Logs** | Registro de peticiones recibidas por cada endpoint con panel en el dashboard. |
| **Perfil** | Gestión de usuario, estadísticas y cambio de plan simulado (Upgrade a Pro). |
| **Rate Limiting** | Límites de peticiones por plan: Starter 100/min, Pro 1000/min, Enterprise ilimitado. |
| **Validación JSON** | El response body se valida como JSON válido al crear/editar endpoints. |
| **Modales** | Ventanas de confirmación y alertas con el estilo de la aplicación (sin `alert()` nativos). |

---

## 🧪 Testing

### Backend
Ejecutar tests de integración:

```bash
cd backend/backend
.\mvnw.cmd test
```

Los tests cubren:
- Registro y login de usuarios
- Creación de endpoints (con límite de plan)
- Eliminación de endpoints
- Respuestas del motor de mocking (`/mock/**`)

### Frontend
*(Próximamente)*

---

## 📜 Licencia

Proyecto desarrollado como Trabajo de Fin de Grado (TFG).

---

<p align="center">
  <strong>MockAgent.AI</strong> — Desarrollado para Agentes de Nueva Generación.<br/>
  © 2026
</p>
