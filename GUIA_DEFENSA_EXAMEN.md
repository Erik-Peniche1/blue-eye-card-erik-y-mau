# 🎓 GUÍA TÉCNICA DE DEFENSA - PROYECTO FINAL
## Blue-Eyes Card Explorer (Examen Práctico de Aplicaciones Web)
**Profesora:** Mtra. Michelle Quintal  
**Tecnología:** Angular (TypeScript, HttpClient, RxJS)  
**Puntuación máxima:** 100 puntos  

---

### 📌 1. Arquitectura y Estructura del Proyecto
El proyecto está estructurado con arquitectura modular desacoplada según las mejores prácticas de Angular:

```text
src/app/
├── models/
│   └── card.model.ts              <-- Interfaces TypeScript estrictas (SIN uso de any)
├── services/
│   └── yugioh.service.ts          <-- Centraliza peticiones HTTP y lógica de negocio
├── components/
│   ├── card/                      <-- Componente visual reutilizable para tarjetas (RF-02)
│   ├── card-detail/               <-- Modal/Ruta para características e impresiones (RF-03, RF-05)
│   ├── search/                    <-- Buscador reactivo con RxJS (RF-01, RF-07)
│   └── blue-eyes/                 <-- Sección de arquetipo Blue-Eyes y filtrado (RF-04, RF-06)
├── app.routes.ts                  <-- Enrutamiento SPA (/search, /blue-eyes, /card/:id)
├── app.config.ts                  <-- Proveedores globales (provideHttpClient)
└── app.ts / app.html / app.css    <-- Shell de la aplicación (Navbar, RouterOutlet, Footer)
```

---

### ❓ Preguntas Frecuentes de la Evaluación Oral y Cómo Responderlas

#### 1. "¿Cómo funciona el servicio `YugiohService`?"
> **Respuesta Técnica:**  
> "El servicio está decorado con `@Injectable({ providedIn: 'root' })`, lo que lo convierte en un singleton disponible en toda la aplicación. Utiliza el cliente reactivo `HttpClient` de Angular para comunicarse con la API de YGOPRODeck (`https://db.ygoprodeck.com/api/v7/cardinfo.php`). Contiene métodos tipados con interfaces TypeScript (`Observable<Card[]>`):
> - `searchCards(term)`: envía el parámetro `fname` para búsqueda parcial o completa, mapea la respuesta con el operador `map` y captura errores 400 con `catchError` para retornar un observable vacío cuando no hay coincidencias.
> - `getBlueEyesCards()`: envía `?archetype=Blue-Eyes` para recuperar la colección completa del arquetipo.
> - `getCardById(id)`: recupera los detalles de una carta específica.
> - `extractUniqueSets(cards)` y `filterCardsBySet(...)`: procesan los datos sin alterar los originales."

---

#### 2. "¿Cuáles operadores RxJS utilizaron y qué hace cada uno en el buscador?"
> **Respuesta Técnica:**  
> "En `SearchComponent` usamos un `Subject<string>` conectado a una tubería (`pipe`) de RxJS con tres operadores clave para optimizar las peticiones y cumplir el RF-01:
> 1. `debounceTime(400)`: Retarda la emisión 400 milisegundos. Evita disparar peticiones HTTP por cada tecla que el usuario presiona mientras escribe.
> 2. `distinctUntilChanged()`: Compara el valor actual con el anterior; si el usuario borra y vuelve a escribir la misma palabra o presiona teclas de control (como shift o flechas), no emite nada nuevo ni repite la consulta.
> 3. `switchMap((term) => ...)`: Cancela la petición HTTP anterior si el usuario introduce un nuevo término antes de que la respuesta previa haya terminado, evitando condiciones de carrera (*race conditions*) y garantizando que solo se procese la última búsqueda activa.
> 4. `tap()`: Permite ejecutar efectos secundarios sincrónicos, como cambiar el estado a `'loading'` antes de que se complete la llamada."

---

#### 3. "¿Cómo eliminaron las expansiones duplicadas de las cartas Blue-Eyes (RF-05)?"
> **Respuesta Técnica:**  
> "La API devuelve para cada carta un arreglo `card_sets` con sus impresiones. Como varias cartas Blue-Eyes se han impreso en el mismo set (por ejemplo, en *Legendary Collection* o *Shining Victories*), iteramos sobre todas las cartas y sus conjuntos y agregamos el `set_name` dentro de un objeto `Set<string>` nativo de JavaScript:
> ```typescript
> const setNames = new Set<string>();
> for (const card of cards) {
>   if (card.card_sets) {
>     for (const set of card.card_sets) {
>       if (set.set_name) {
>         setNames.add(set.set_name.trim());
>       }
>     }
>   }
> }
> return Array.from(setNames).sort();
> ```
> La estructura `Set` garantiza por definición matemática y computacional que no existan valores duplicados en tiempo $O(1)$ por inserción. Luego usamos `Array.from()` y `.sort()` para ordenar alfabéticamente el catálogo de expansiones."

---

#### 4. "¿Cómo funciona el filtro dinámico de expansiones (RF-06)?"
> **Respuesta Técnica:**  
> "Mantenemos dos arreglos en `BlueEyesComponent`:
> - `allCards`: almacena el universo completo de cartas recibidas de la API.
> - `filteredCards`: el arreglo que se le pasa al template para renderizar.
> Cuando el usuario selecciona una opción en el `<select>`, se ejecuta `filterCardsBySet(this.allCards, selectedExpansion)`. Si el valor es `'ALL'`, muestra todas. De lo contrario, usamos `.filter()` y verificamos si la carta tiene al menos una impresión en ese set mediante `card.card_sets?.some(s => s.set_name === selectedExpansion)`. Al no mutar el arreglo original `allCards`, el usuario puede cambiar de filtro instantáneamente sin volver a llamar a la API."

---

#### 5. "¿Cómo manejaron los 4 estados de la aplicación (RF-07)?"
> **Respuesta Técnica:**  
> "Definimos un tipo unión estricto: `export type ViewState = 'loading' | 'success' | 'empty' | 'error'`.
> En los templates condicionamos con directivas estructurales `*ngIf`:
> - **Loading:** Muestra un indicador giratorio visual con CSS mientras el Observable está en tránsito.
> - **Success:** Muestra la cuadrícula de tarjetas (`cards-grid`).
> - **Empty:** Muestra un mensaje amigable indicando que no hubo cartas encontradas. Se activa cuando la API devuelve un arreglo vacío o código 400 de no coincidencias.
> - **Error:** Muestra un aviso de error visual con icono y botón de reintentar si falla la conexión de red o el servidor responde 500, garantizando que el usuario nunca vea una pantalla rota."

---

#### 6. "¿Por qué no se usó `any` y qué ventaja tiene?"
> **Respuesta Técnica:**  
> "El uso de `any` desactiva el verificador estático de tipos de TypeScript. En su lugar, modelamos las interfaces `Card`, `CardSet`, `CardImage`, `CardPrice` y `CardApiResponse` en `src/app/models/card.model.ts`. Esto previene errores en tiempo de ejecución (como acceder a propiedades inexistentes), provee autocompletado en el IDE y garantiza robustez técnica de nivel Senior."
