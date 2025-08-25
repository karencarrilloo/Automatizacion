# 🧪 Proyecto de Automatización OSS - Celsia

# Automatización con Selenium WebDriver, Mocha y Chai

Este proyecto realiza automatización de pruebas sobre una aplicación web(emalaea) utilizando Selenium WebDriver con Mocha y Chai bajo módulos ESM (`.mjs` y `.page.js`).

---

## 📁 Estructura del proyecto

```
automatizacion-celsia/
├── config/ # Configuración general del proyecto
├── data/ # Archivos de datos para pruebas
├── database/ # Conexión y utilidades para la base de datos
├── diagrams/ # Diagramas de flujo o documentación visual
├── drivers/ # Drivers necesarios para la automatización
├── errores/ # Capturas de error
├── node_modules/ # Dependencias del proyecto
├── pages/ # Page Objects (ESM modules)
│ ├── login.page.js
│ └── ...otros archivos.page.js
├── reports/ # Reportes de ejecución de pruebas
├── tests/ # Pruebas automatizadas
│ ├── login.mjs
│ └── ...otros archivos.mjs
├── utils/ # Utilidades y helpers
├── .env # Variables de entorno
├── .env.example # Ejemplo de configuración de variables
├── .gitignore # Archivos ignorados por git
├── package.json # Configuración del proyecto
├── package-lock.json # Control de versiones de dependencias
└── README.md # Instrucciones de uso
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

⚙️ Variables de entorno

En el archivo .env debes definir tus credenciales:

## Credenciales Oracle Database
DB_USER=usuario
DB_PASSWORD=contraseña
DB_CONNECT_STRING=(DESCRIPTION=...)


## 🧪 Ejecutar pruebas

### Ejecutar todas las pruebas (no recomendable, méjor ejecutar una prueba específica):
Estar ubicado en la carpeta Automatización

```bash
npm test
```

### Ejecutar una prueba específica (ej. login):
```bash
npx mocha tests/login.mjs 
```

## 🧰 Scripts disponibles

En `package.json` puedes encontrar:

```json
"scripts": {
  "test": "mocha tests/**/*.mjs --timeout 180000"
}
```
Puedes modificar este comando si quieres ejecutar únicamente algunos tests específicos o por carpeta.

---

## 📸 Captura de errores(realizar mejoras)

Si ocurre un error durante una prueba, se genera una captura de pantalla en la carpeta `errores/` con nombre: 

```
error_<nombre>_<timestamp>.png
```

---

## 💡 Consejos

En caso de que al ejecutar un test aparezca un error relacionado con dependencias, configuraciones o ejecución, puedes consultar un asistente de IA (por ejemplo, ChatGPT) para obtener una guía más rápida hacia la solución.


---

## 📞 Soporte

Para cualquier duda o mejora, contactar al equipo de QA.
