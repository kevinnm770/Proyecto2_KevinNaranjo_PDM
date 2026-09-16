# Explorador de Películas

Proyecto Programado 2: Explorador de Datos y Consumo de APIs

| | |
|---|---|
| Curso | Programación para Dispositivos Móviles (TPA-4001) |
| Profesor | Diego Carrillo |
| Periodo | Semanas 7 a 10 |
| Estudiante | Kevin Naranjo |

## Descripción

Aplicación móvil que consume la API pública de OMDb para buscar películas, series
y episodios por nombre, con filtros de tipo y año. Permite abrir la ficha completa
de cada título y guardar favoritos con una puntuación de 1 a 5 estrellas en una
base de datos SQLite local que persiste entre sesiones.

- Búsqueda por nombre, con manejo explícito de carga, error y sin resultados.
- Filtros por tipo (película, serie, episodio) y por año.
- Ficha con póster, sinopsis, género, director, reparto, estreno y nota de IMDb.
- Favoritos persistentes, con puntuación propia y opción de eliminar.
- Contador de favoritos en la barra superior, actualizado desde cualquier
  pantalla mediante estado global.

## Requisitos previos

- Node.js 22.13 o superior (lo exige Expo SDK 57).
- Una API key gratuita de OMDb (ver la sección siguiente).

## Obtención de la API key de OMDb

**1. Solicitarla.** En <https://www.omdbapi.com/apikey.aspx>, elegir el tipo de
cuenta gratuito, identificado como *FREE! (1,000 daily limit)*, e indicar un
correo electrónico válido, que es donde llega la clave.

**2. Activarla.** Este paso es obligatorio y es el olvido más común: una clave
recién emitida no funciona hasta que se activa. El correo de OMDb incluye un
enlace con el formato

```
http://www.omdbapi.com/apikey.aspx?VERIFYKEY=00000000-0000-0000-0000-000000000000
```

y hay que abrirlo. Si el mensaje no llega, conviene revisar el correo no deseado y
esperar un rato; la propia página advierte que puede demorarse en cuentas de Yahoo
y de Microsoft.

**3. Colocarla en el proyecto.** Copiar `.env.example` como `.env` en la raíz del
proyecto, es decir junto a `package.json`, y escribir la clave sin comillas ni
espacios:

```
EXPO_PUBLIC_OMDB_API_KEY=9b1c2d3a
```

El nombre de la variable debe conservarse tal cual: el prefijo `EXPO_PUBLIC_` es
lo que permite que Expo exponga el valor al código. Ese mismo prefijo incrusta la
clave en el paquete compilado, lo cual es aceptable para una clave gratuita como
esta, pero no sería el mecanismo adecuado para una credencial sensible. El archivo
`.env` está excluido del repositorio, así que cada persona que lo clone debe crear
el suyo.

**4. Comprobarla.** Antes de levantar la aplicación conviene probar la clave en el
navegador:

```
https://www.omdbapi.com/?apikey=SU_CLAVE&s=batman
```

Si la respuesta comienza con `{"Search":[...`, la clave está activa.

### Errores frecuentes

| Mensaje | Causa |
|---|---|
| `Falta la API key: agregala en el archivo .env...` | Mensaje propio de la aplicación: el archivo `.env` no existe, la variable está vacía, su nombre no coincide exactamente con `EXPO_PUBLIC_OMDB_API_KEY`, o el servidor se inició antes de crear el archivo. |
| `Invalid API key!` | La clave está mal copiada, o no se activó con el enlace del paso 2. |
| `No API key provided.` | Solo aparece al probar la dirección a mano sin el parámetro `apikey`. La aplicación nunca produce este error, porque valida la variable antes de llamar al servicio. |
| `Movie not found!` | No es un error de configuración: la búsqueda no arrojó resultados. |

## Instalación y ejecución

```bash
npm install     # instalar dependencias
npm start       # iniciar el servidor de desarrollo
```

Entre ambos comandos hay que crear el archivo `.env` con la API key. Luego se abre
la aplicación en un emulador Android, un simulador iOS o Expo Go.

Expo inyecta las variables de entorno al empaquetar, no en tiempo de ejecución. Si
se modifica `.env` con el servidor encendido, hay que reiniciarlo con
`npx expo start --clear` y recargar la aplicación por completo; una recarga rápida
no toma el valor nuevo.

Otros comandos: `npm run android`, `npm run ios` y `npm run lint`.

La aplicación está pensada para dispositivos móviles. La plataforma web no está
soportada, porque `expo-sqlite` requiere el módulo WebAssembly de `wa-sqlite`, que
Metro no resuelve sin configuración adicional.

## API utilizada

[OMDb API](https://www.omdbapi.com/), servicio REST con información de películas y
series basada en datos de IMDb. Toda la comunicación está aislada en `lib/api`, de
modo que ninguna pantalla conoce la URL, la clave ni el formato de la respuesta.

**Búsqueda**, devuelve hasta diez resultados por página:

```
GET https://www.omdbapi.com/?apikey=CLAVE&s=<titulo>&type=<tipo>&y=<anio>
```

| Parámetro | Uso |
|---|---|
| `s` | Texto del buscador. Obligatorio. |
| `type` | Categoría: `movie`, `series` o `episode`. Se omite en la opción "Todos". |
| `y` | Año. Se valida en el cliente (cuatro dígitos) antes de enviar la petición. |

**Detalle**, ficha completa a partir del identificador de IMDb:

```
GET https://www.omdbapi.com/?apikey=CLAVE&i=<imdbID>&plot=short
```

### Manejo de la respuesta

La API tiene dos comportamientos que el cliente contempla de forma explícita:

1. **El error viaja en el cuerpo, no solo en el código HTTP.** Ante una clave
   inválida, OMDb responde con estado 401 pero el motivo está en el campo `Error`
   del JSON. Por eso `omdb-client.ts` lee el cuerpo antes de evaluar el estado, y
   muestra "Invalid API key!" en lugar de un genérico "HTTP 401".

2. **Una búsqueda sin resultados se reporta como error.** OMDb responde con
   estado 200 y `{"Response":"False","Error":"Movie not found!"}`. La capa de
   servicio traduce ese caso a una lista vacía, para presentarlo como un aviso y
   no como un fallo.

Los campos que el servicio no tiene llegan con el texto literal `"N/A"`, frecuente
en pósters y calificaciones de series y episodios; la ficha los trata como
ausentes y omite la fila. Las peticiones se cancelan con `AbortController` cuando
el usuario lanza una búsqueda nueva o abandona una pantalla.

### Limitación conocida

OMDb no permite filtrar por género: el campo `Genre` solo aparece en la respuesta
de detalle. Por eso el filtro de categoría usa el parámetro `type`, que sí es
nativo del servicio, y el género de cada título se muestra en su ficha.

## Base de datos local

SQLite mediante `expo-sqlite`, con `drizzle-orm` para construir las consultas de
forma tipada. La base se llama `peliculas.db` y se crea en el dispositivo la
primera vez que se abre la aplicación, con `CREATE TABLE IF NOT EXISTS`, de modo
que la operación es idempotente.

Tabla `favorites`:

| Columna | Tipo | Descripción |
|---|---|---|
| `imdb_id` | TEXT | Llave primaria. El identificador de IMDb impide guardar la misma película dos veces. |
| `title` | TEXT | Título. |
| `year` | TEXT | Año. Es texto porque OMDb devuelve rangos en las series, por ejemplo `1992-1995`. |
| `type` | TEXT | `movie`, `series` o `episode`. |
| `poster` | TEXT | URL del póster. Nulo cuando OMDb no lo tiene. |
| `rating` | INTEGER | Puntuación del usuario, de 1 a 5. Nula mientras no la asigne. |
| `created_at` | INTEGER | Marca de tiempo. Ordena la lista de favoritos. |

El archivo `db/favorites.ts` funciona como objeto de acceso a datos y concentra
todo lo que toca la tabla: `addFavorite` (no duplica ni borra la puntuación si el
registro ya existe), `removeFavorite`, `readAllFavorites`, `isFavorite` y
`setRating`, que acepta un valor nulo para retirar la puntuación sin dejar de
tener la película guardada.

Como la puntuación es una columna de `favorites`, no puede existir sin que la
película esté guardada. Por eso puntuar un título que no estaba en la lista lo
guarda primero y luego le asigna la nota.

## Estado global

Los favoritos se manejan con Context API. `FavoritesProvider` envuelve la
aplicación desde `app/_layout.tsx` y mantiene en memoria el contenido de la base;
cada escritura persiste en SQLite y vuelve a leer la tabla, de modo que memoria y
disco nunca quedan desincronizados. Como la lista está en memoria, `isFavorite` y
`getRating` son síncronas y las pantallas no necesitan efectos asíncronos para
consultarlas. El hook `useFavorites` es el único punto de acceso y lanza un error
descriptivo si se usa fuera del proveedor.

## Arquitectura

La lógica de red, la de base de datos y las vistas viven en carpetas
independientes. Ninguna pantalla importa `fetch` ni ejecuta SQL.

```
app/                        Pantallas y navegación (expo-router)
  _layout.tsx               Stack de navegación y proveedor de favoritos
  index.tsx                 Buscador con filtros
  favorites.tsx             Lista de favoritos
  movie/[id].tsx            Ficha de detalle, ruta dinámica
components/                 Presentación, sin lógica de datos
  MovieCard.tsx             Tarjeta reutilizada por búsqueda y favoritos
  TypeFilter.tsx            Selector de categoría
  StarRating.tsx            Estrellas, interactivas o de solo lectura
  DetailRow.tsx             Fila etiqueta/valor de la ficha
  FavoritesHeaderButton.tsx Contador de la barra superior
context/FavoritesContext.tsx  Estado global de favoritos
hooks/useFavorites.ts         Acceso al contexto
db/                         Capa de datos
  client.ts                 Apertura de la base y creación de la tabla
  schema.ts                 Definición de la tabla con Drizzle
  favorites.ts              Objeto de acceso a datos
lib/api/                    Capa de red
  omdb-client.ts            Cliente HTTP, API key y manejo de errores
  omdb.ts                   Búsqueda y detalle
  types.ts                  Tipos de las respuestas de OMDb
styles/GlobalStyles.ts      Hoja de estilos compartida
```

## Librerías instaladas

| Librería | Versión | Función |
|---|---|---|
| `expo` | ^57.0.0 | Plataforma base |
| `react-native` | 0.86.3 | Framework de interfaz nativa |
| `react` | 19.2.3 | Biblioteca de componentes |
| `expo-router` | ~57.0.21 | Navegación por archivos y rutas dinámicas |
| `expo-sqlite` | ~57.0.3 | Base de datos SQLite en el dispositivo |
| `drizzle-orm` | ^0.45.2 | ORM tipado para las consultas SQL |
| `typescript` | ~6.0.3 | Tipado estático (desarrollo) |
| `eslint` + `eslint-config-expo` | ^9.25.0 / ~57.0.2 | Análisis estático (desarrollo) |

El proyecto conserva además las dependencias que trae la plantilla de
`create-expo-app`, que dan soporte a la navegación y al arranque de la aplicación.
