# ♿ Accesibilidad y Usuarios Objetivo

## 📌 ¿A qué tipo de usuario avanzado va dirigida esta página?

Esta página web está orientada principalmente a usuarios que utilizan **tecnologías de asistencia** para navegar por Internet, así como a personas que presentan necesidades específicas de accesibilidad.

### 👨‍🦯 Usuarios con discapacidad visual

Personas que utilizan lectores de pantalla como:

* NVDA
* JAWS
* VoiceOver

La implementación de atributos semánticos y etiquetas ARIA permite que estos programas interpreten correctamente la estructura y el contenido del sitio.

---

### ⌨️ Usuarios que navegan únicamente con teclado

La interfaz permite acceder a todas las funcionalidades sin necesidad de utilizar un mouse.

Características implementadas:

* Skip Link para saltar directamente al contenido principal.
* Indicadores visibles de foco.
* Navegación lógica mediante la tecla **Tab**.
* Compatibilidad con controles accesibles.

---

### 👓 Usuarios con baja visión

El diseño incorpora elementos que facilitan la lectura y comprensión del contenido:

* Alto contraste entre texto y fondo.
* Tipografía clara y legible.
* Jerarquía visual bien definida.
* Diseño adaptable a distintos tamaños de pantalla.

---

### 🧠 Usuarios con dificultades cognitivas o de aprendizaje

La estructura de navegación fue diseñada para ser intuitiva y sencilla.

Se utilizan:

* Secciones claramente identificadas.
* Títulos descriptivos.
* Botones con acciones comprensibles.
* Organización visual consistente.

---

# ❓ ¿Por qué está dirigida a estos usuarios?

La página fue desarrollada siguiendo principios de **Diseño Universal**, buscando que cualquier persona pueda acceder al contenido independientemente de sus capacidades físicas, sensoriales o cognitivas.

Para lograrlo se incorporaron diversas características de accesibilidad.

## 🏗️ Estructura semántica

Se utilizan etiquetas HTML5 como:

```html
<header>
<nav>
<main>
<section>
<footer>
```

Esto permite que las tecnologías asistivas comprendan la organización del sitio y faciliten la navegación.

---

## 🏷️ Uso de atributos ARIA

Se implementan atributos como:

```html
aria-label
aria-controls
aria-selected
aria-expanded
aria-live
```

Estos atributos proporcionan contexto adicional a los lectores de pantalla y mejoran la experiencia de usuarios con discapacidad visual.

---

## ⌨️ Navegación accesible

Todos los elementos interactivos pueden utilizarse mediante teclado.

Además:

* El foco es visible en todo momento.
* El orden de navegación es coherente.
* Los componentes interactivos informan correctamente su estado.

---

## 🎨 Diseño visual accesible

La interfaz fue construida considerando:

* Contraste adecuado de colores.
* Textos legibles.
* Escalabilidad de contenido.
* Adaptación a distintos dispositivos.

Estas características benefician especialmente a usuarios con baja visión o dificultades de percepción visual.

---

# 📖 Cumplimiento de WCAG 2.1 AA

La implementación se alinea con múltiples criterios del estándar internacional **WCAG 2.1 Nivel AA**, entre ellos:

| Criterio | Descripción                                          |
| -------- | ---------------------------------------------------- |
| 1.3.1    | Información y relaciones correctamente estructuradas |
| 1.4.3    | Contraste mínimo de color                            |
| 1.4.4    | Redimensionamiento de texto                          |
| 2.1.1    | Navegación por teclado                               |
| 2.4.6    | Encabezados y etiquetas descriptivas                 |
| 2.4.7    | Indicadores visibles de foco                         |

---

# 🇪🇺 Relación con la European Accessibility Act (EAA)

La **European Accessibility Act (EAA)** promueve que los servicios digitales sean accesibles para toda la población.

Las características implementadas en este sitio contribuyen al cumplimiento de requisitos como:

✅ Navegación mediante teclado.

✅ Compatibilidad con tecnologías asistivas.

✅ Contenido estructurado semánticamente.

✅ Uso de textos alternativos.

✅ Adaptabilidad a diferentes dispositivos.

✅ Experiencia accesible para personas con discapacidad.

---

# ✅ Conclusión

Aunque la página puede ser utilizada por cualquier usuario, su diseño presta especial atención a personas que utilizan tecnologías de apoyo o presentan limitaciones visuales, motrices o cognitivas.

La incorporación de buenas prácticas de accesibilidad permite ofrecer una experiencia más inclusiva, garantizando que el contenido sea:

* Perceptible.
* Operable.
* Comprensible.
* Robusto.

Estos principios constituyen la base de las **WCAG 2.1 AA** y de la **European Accessibility Act (EAA)**, convirtiendo el sitio en una solución más accesible y preparada para una amplia diversidad de usuarios.

