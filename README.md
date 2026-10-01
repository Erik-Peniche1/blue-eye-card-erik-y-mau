# 🐉 Blue-Eyes Card Explorer

Aplicación web desarrollada en **Angular** que consume la API pública oficial de **YGOPRODeck** para la búsqueda, exploración y visualización de cartas de Yu-Gi-Oh!, con una sección especializada dedicada al arquetipo legendario **Blue-Eyes**.

---

## 📋 Información de la Entrega
- **Materia:** Aplicaciones Web
- **Carrera:** Ingeniería en Desarrollo y Gestión de Software
- **Evaluadora:** Mtra. Michelle Quintal
- **Valor:** 100 puntos
- **Integrantes del Equipo:**
  - Integrante 1: [Nombre y Apellidos]
  - Integrante 2: [Nombre y Apellidos]

---

## 🚀 Requerimientos Implementados

| Requisito | Descripción | Puntos | Estado |
|---|---|:---:|:---:|
| **RF-01** | **Buscador de cartas:** Permite introducir nombre completo o parcial con debounceTime, distinctUntilChanged y switchMap en RxJS | 20 pts |  Completado |
| **RF-02** | **Resultados en tarjetas:** Componente reutilizable (`CardComponent`) que maneja imagen, nombre, tipo, atributo, nivel, ATK y DEF, tolerando cartas sin dichas propiedades (magias/trampas) | 15 pts |  Completado |
| **RF-03** | **Detalle de carta:** Modal y ruta (`/card/:id`) con imagen, nombre, descripción completa, estadísticas, precios y arquetipo | 15 pts |  Completado |
| **RF-04** | **Blue-Eyes Collection:** Sección dedicada que consulta la API con `?archetype=Blue-Eyes` y muestra las cartas con tarjetas reutilizables | 20 pts |  Completado |
| **RF-05** | **Expansiones de Blue-Eyes:** Procesa automáticamente las impresiones (`card_sets`), elimina duplicados mediante `Set`, y muestra tabla con Expansión, Código, Rareza y Precio | 15 pts |  Completado |
| **RF-06** | **Filtro de expansión:** Selector dinámico que filtra las cartas Blue-Eyes según la expansión seleccionada en tiempo real | 10 pts |  Completado |
| **RF-07** | **Manejo de estados:** Estados visuales en UI para *Loading*, *Success*, *Empty* y *Error* (con reintento) | 5 pts |  Completado |
| **Total** | | **100 pts** | **100% Cumplido** |

---

## 🛠️ Requisitos Técnicos y Restricciones
-  **TypeScript Estricto:** Prohibición del uso de `any` respetada al 100% mediante interfaces en `src/app/models/card.model.ts`.
-  **Servicio Centralizado:** Comunicación con YGOPRODeck a través de `YugiohService`.
-  **Sin JSONs locales:** Toda la información se consulta dinámicamente desde los endpoints de YGOPRODeck.
-  **Separación de componentes:** Arquitectura desacoplada en `CardComponent`, `CardDetailComponent`, `SearchComponent` y `BlueEyesComponent`.

---

## 💻 Instrucciones de Ejecución

### 1. Instalar dependencias (si es primera vez)
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm start
# o también:
ng serve
```

La aplicación estará disponible en [http://localhost:4200/](http://localhost:4200/).

### 3. Compilación para producción
```bash
npm run build
```

---

## 📖 Guía para la Defensa Oral
Consulta el archivo [GUIA_DEFENSA_EXAMEN.md](./GUIA_DEFENSA_EXAMEN.md) para estudiar y responder con soltura las preguntas técnicas del examen (operadores RxJS, algoritmos de conjuntos únicos, manejo de errores, etc.).
