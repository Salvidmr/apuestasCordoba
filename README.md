
# 🏆 Apuestas Córdoba

Aplicación web completa para la gestión de competiciones de pronósticos deportivos. Desarrollada con **Spring Boot (backend)** y **React.js (frontend)**. Incluye paneles diferenciados para usuarios y administradores.

---

## 📁 Estructura del proyecto

```
/apuestas-cordoba/
│
├── apuestasCordoba/        → Spring Boot (API REST + Seguridad JWT + JPA)
├── frontend-apuestas/       → React.js (UI cliente)
└── README.md
```

---

## 🚀 Requisitos previos

- Java 17 o superior
- Node.js 18 o superior
- PostgreSQL (u otra base de datos compatible)
- Maven
- Git (opcional)

---

## 🔧 Configuración del backend

1. Ve a la carpeta del backend:

   ```bash
   cd apuestasCordoba
   ```

2. Configura el archivo `application.properties` con los datos de tu base de datos:

   ```properties
   spring.application.name=apuestasCordoba

   spring.datasource.url=jdbc:postgresql://localhost:5432/apuestas_db
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
   spring.datasource.driver-class-name=org.postgresql.Driver

   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   server.port=8080

   jwt.secret=clave_secreta
   jwt.expiration=3600000

   ```

3. Inicia el backend:

   ```bash
   ./mvnw spring-boot:run
   ```

   O si usas Maven instalado globalmente:

   ```bash
   mvn spring-boot:run
   ```

---

## 🌐 Configuración del frontend

1. Ve a la carpeta del frontend:

   ```bash
   cd frontend-apuestas
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Accede a la aplicación desde tu navegador en:

   ```
   http://localhost:5173
   ```

   > ⚠️ Asegúrate de que el backend (puerto 8080) está también levantado.

---

## 👥 Cuentas de prueba

Puedes crear usuarios directamente desde el registro en el frontend.  
Para el **admin**, se puede insertar manualmente en la base de datos con rol `"admin"`.

```sql
-- Ejemplo para PostgreSQL
INSERT INTO usuarios (nombre_usuario, email, password, rol, fecha_registro)
VALUES ('adminCordoba', 'admin@cordoba.com', '$2a$10$JYv..V7A1pGeUCLBzFz2NOxErK0TEnY0zrzQZ41MdAK3JSpc/Z5lW', 'admin', CURRENT_TIMESTAMP);
```

> Contraseña: `1234` (ya encriptada con BCrypt)

---

## 📝 Funcionalidades principales

### 👤 Usuario
- Ver competiciones en las que participa
- Realizar pronósticos
- Ver clasificación y pronósticos de otros (tras empezar el partido)
- Diferenciación visual de su propio pronóstico

### 🛠️ Administrador
- Crear competiciones, partidos y usuarios
- Asignar puntos por resultado exacto o acierto simple
- Calcular puntos automáticamente
- Tablón de anuncios para cada competición

---

## 🧪 Pruebas y despliegue

- El sistema ha sido probado con múltiples usuarios simultáneos
- Se recomienda usar Postman para pruebas de endpoints (opcional)
- A futuro se podrá desplegar en plataformas como Heroku, Railway, o Render

---

## 🗃️ Control de versiones

Este proyecto se encuentra bajo control de versiones con Git y alojado en GitHub.

🔗 Repositorio: https://github.com/Salvidmr/apuestasCordoba.git

---

## 📌 Notas finales

- La estructura está pensada para una fácil escalabilidad
- Se ha separado completamente frontend y backend
- Seguridad mediante JWT implementada
- Diseño responsive y accesible

---

¡Gracias por revisar el proyecto! ⚽
