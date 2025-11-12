# 🧪 Proyecto de Automatización OSS - Celsia

# Automatización con Selenium WebDriver, Mocha y Chai

Este proyecto realiza automatización de pruebas sobre una aplicación web(emalaea) utilizando Selenium WebDriver con Mocha y Chai bajo módulos ESM (`.mjs` y `.page.js`).

---

## 📁 Estructura del proyecto

```
Automatizacion/
├── docs/                         # Documentación y diagramas del proyecto
├── errors/                       # Capturas y logs de errores en ejecución
├── node_modules/                 # Dependencias del proyecto (instaladas con npm)
├── src/                          # Carpeta principal del código fuente
│   ├── config/                   # Configuración y datos centralizados (testData, variables globales)
│   ├── database/                 # Conexiones y utilidades de base de datos
│   ├── pages/                    # Módulos y vistas del sistema
│   │   ├── eCenter/              # Módulo eCenter
│   │   │   ├── autodiagnostico/                  # Vista Autodiagnóstico
│   │   │   │   └── Autodiagnostico.page.js
│   │   │   ├── contenidoClasesNegocio/           # Vista Contenido clases de negocio
│   │   │   ├── exploradorEntidades/              # Vista Explorador de entidades
│   │   │   ├── gestionActivos/                   # Vista Gestión de activos
│   │   │   ├── gestionCambioNapPuerto/           # Vista Gestión de cambio de NAP y puerto
│   │   │   ├── gestionClientesServiciosDomiciliarios/ # Vista Gestión de clientes y servicios domiciliarios
│   │   │   ├── motorReglas/                      # Vista Motor de reglas
│   │   │   ├── ocupacionPuertos/                 # Vista Ocupación de puertos
│   │   │   ├── programadorTareas/                # Vista Programador de tareas
│   │   │   ├── tareasProgramadasAutodiagnostico/ # Vista Tareas programadas autodiagnóstico
│   │   │   ├── visorInformacionTecnicaRed/       # Vista Visor de información técnica de red
│   │   │   └── ...otras vistas relacionadas
│   │   ├── eContract/             # Módulo eContract
│   │   ├── eProvisioning/         # Módulo eProvisioning
│   │   ├── eWorkForce/            # Módulo eWorkForce
│   │   └── login/                 # Módulo de autenticación/login
│   │       └── login.page.js
│   ├── tests/                     # Pruebas automatizadas organizadas por módulo
│   │   ├── eCenter/               # Pruebas del módulo eCenter
│   │   ├── eContract/             # Pruebas del módulo eContract
│   │   ├── eProvisioning/         # Pruebas del módulo eProvisioning
│   │   ├── eWorkForce/            # Pruebas del módulo eWorkForce
│   │   └── login/                 # Pruebas del módulo de autenticación
│   └── utils/                     # Funciones auxiliares y helpers reutilizables
├── .env                           # Variables de entorno locales
├── .env.example                   # Ejemplo de archivo de entorno
├── .gitignore                     # Archivos y carpetas ignoradas por git
├── package.json                   # Configuración del proyecto, dependencias y scripts
├── package-lock.json              # Control de versiones de dependencias instaladas
└── README.md                      # Documentación del proyecto


```

---

## 🚀 Requisitos previos

- Node.js ≥ 14
- Navegador **Google Chrome**
- ChromeDriver compatible (mantenido automáticamente por Selenium)
- [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client.html) ≥ 21.9  
- Microsoft Visual C++ 2019 Redistributable (x64)  
- Credenciales válidas de Oracle Autonomous Database (se configuran en `.env`)

---

## 🔧 Instalación del proyecto

1. Clona el repositorio o descarga el proyecto:

```bash
git clone <URL_REPOSITORIO>
cd automatizacion-celsia
```

2. Instala las dependencias

```bash

npm init -y 
npm install selenium-webdriver mocha chai oracledb dotenv --save

```

Esto iniciará el proyecto e instalará:
- `selenium-webdriver` → Automatización del navegador.
- `mocha` → Framework de pruebas.
- `chai` → Librería de aserciones.
- `oracledb` → Cliente para conexión con Oracle Database.
- `dotenv` → Carga de variables de entorno desde .env.

---

## ⚙️ Variables de entorno

En el archivo .env debes definir tus credenciales:

### Credenciales Oracle Database
DB_USER=usuario
DB_PASSWORD=contraseña
DB_CONNECT_STRING=(DESCRIPTION=...)


## 🧪 Ejecutar pruebas

Los casos de prueba automatizados están organizados dentro de la carpeta src/tests
donde cada subcarpeta corresponde a un módulo o vista del sistema (por ejemplo: eCenter, eProvisioning, login, etc.).
Cada archivo con extensión .mjs contiene uno o varios casos de prueba asociados a esa vista.

### Ejecutar una prueba específica

Para ejecutar un archivo de prueba en particular, ubícate en la raíz del proyecto y utiliza el siguiente comando, ajustando la ruta según el archivo que desees correr:

```bash
npx mocha ".\src\tests\<modulo>\<nombreArchivo>.mjs" 
```

### Ejemplo login:

```bash
npx mocha ".\src\tests\login\login.spec.mjs" 
```

### Ejecutar solo un caso de prueba o saltar uno específico

Para ejecutar únicamente un caso de prueba, agrega .only al bloque it dentro del archivo .mjs :

```bash
it.only('CP_LOGIN_001: Inicio de sesión exitoso', async () => {
  // ...
});
```
Para omitir temporalmente un caso de prueba, usa .skip:

```bash
it.skip('CP_LOGIN_002: Inicio de sesión fallido', async () => {
  // ...
});
```


## 📸 Captura de errores(en implementación)

Si ocurre un error durante una prueba, se genera una captura de pantalla en la carpeta `errores/` con nombre: 

```
error_<nombre>_<timestamp>.png
```

---

## 💡 Consejos

En caso de que al ejecutar un test aparezca un error relacionado con dependencias, configuraciones o ejecución, puedes consultar un asistente de IA (copiar y pegar el error) para obtener una guía más rápida hacia la solución.

---

## 📞 Soporte

Para cualquier duda o mejora, contactar al equipo de Pruebas.
