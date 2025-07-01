# 🧪 Proyecto de Automatización OSS - Celsia

# Automatización con Selenium WebDriver, Mocha y Chai

Este proyecto realiza automatización de pruebas sobre una aplicación web utilizando Selenium WebDriver con Mocha y Chai bajo módulos ESM (`.mjs` y `.page.js`).

---

## 📁 Estructura del proyecto

```
automatizacion-celsia/
├── pages/                     # Page Objects (ESM modules)
│   ├── login.page.js
│   └── ...otros archivos.page.js
├── tests/                     # Pruebas automatizadas
│   ├── login.mjs
│   └── ...otros archivos.mjs
├── errores/                   # Capturas de error
├── package.json               # Configuración del proyecto
└── README.md                  # Instrucciones de uso
```

---

## 🚀 Requisitos previos

- Node.js ≥ 14
- Navegador **Google Chrome**
- ChromeDriver compatible (automáticamente manejado por Selenium)

---

## 🔧 Instalación del proyecto

1. Clona el repositorio o descarga el proyecto:

```bash
git clone <URL_REPOSITORIO>
cd automatizacion-celsia
```

2. Instala las dependencias:

```bash
npm install
```

Esto instalará:
- `selenium-webdriver`
- `mocha`
- `chai`

---

## 🧪 Ejecutar pruebas

### Ejecutar todas las pruebas:
```bash
npm test
```

### Ejecutar una prueba específica (ej. login):
```bash
npx mocha tests/login.mjs --timeout 180000
```

### Otras pruebas individuales:

```bash
npx mocha tests/puertosActivos.mjs
npx mocha tests/gestionActivos.mjs
npx mocha tests/contenidoClasesNegocio.mjs
npx mocha tests/gestionCambioNapPuerto.mjs
npx mocha tests/gestionContratos.mjs
npx mocha tests/exploradorEntidades.mjs
npx mocha tests/motorReglas.mjs
npx mocha tests/programadorTareas.mjs
npx mocha tests/ocupacionPuertos.mjs
npx mocha tests/configuracionTipoOrden.mjs
```

---

## 🧰 Scripts disponibles

En `package.json` puedes encontrar:

```json
"scripts": {
  "test": "mocha tests/**/*.mjs --timeout 180000"
}
```
Puedes modificar este comando si quieres ejecutar únicamente algunos tests específicos o por carpeta.

---

## 📸 Captura de errores

Si ocurre un error durante una prueba, se genera una captura de pantalla en la carpeta `errores/` con nombre: 

```
error_<nombre>_<timestamp>.png
```

---

## 💡 Consejos

- Asegúrate de tener **resolución completa** para que los elementos no queden fuera del viewport.
- Si una prueba no da clic correctamente, asegúrate de que no haya overlays o modales abiertos.
- Usa scroll dinámico si algún campo no es visible.

---

## 📞 Soporte

Para cualquier duda o mejora, contactar al equipo de QA o desarrollo.