Tienda Virtual de Libros

Proyecto desarrollado en JavaScript y HTML utilizando Programación Orientada a Objetos (POO).  
La aplicación permite visualizar un catálogo de libros, categorizarlos, buscarlos y administrarlos dentro de un carrito de compras interactivo.

-------------------------------

Características

- Mostrar catálogo de libros
- Filtrar por categorías
- Buscar libros por nombre o autor
- Agregar productos al carrito
- Aumentar o disminuir cantidades
- Eliminar productos
- Vaciar carrito
- Simular proceso de compra
- Actualización dinámica del DOM
- Interfaz interactiva con notificaciones

-------------------------------

Tecnologías utilizadas

- HTML
- Style (CSS)
- Archivo JS
- Programación Orientada a Objetos (POO)

-------------------------------

Estructura del Proyecto

```bash
Tienda_libros
│
├── index.html
├── style.css
├── app.js
└── markdown.md
```

-------------------------------

Clases principales

# 1. Clase `Producto`

Representa cada libro dentro del catálogo.

Propiedades

- `id`
- `nombre`
- `autor`
- `precio`
- `emoji`
- `categoria`
- `descripcion`

Getter

```js
get precioFormateado()
```

Devuelve el precio a cero.

-------------------------------

# 2. Clase `Carrito`

Gestionar todos los productos agregados al carrito.

Métodos principales

```js
agregarProducto()
eliminarProducto()
cambiarCantidad()
calcularTotal()
contarItems()
vaciarCarrito()
renderizar()
```

Funciones:

- Agregar productos
- Modificar cantidades
- Calcular total
- Renderizar el carrito dinámicamente

-------------------------------

# 3. Clase `Tienda`

Controla toda la lógica principal de la aplicación.

Responsabilidades

- Renderizar catálogo
- Filtrar productos
- Buscar libros
- Manejar eventos
- Abrir/cerrar carrito
- Mostrar notificaciones

 Métodos importantes

```js
renderCatalogo()
_productosFiltrados()
_renderCarrito()
_abrirCarrito()
_cerrarCarrito()
_mostrarToast()
_initEventos()
```

-------------------------------

Sistema de filtros

El catálogo puede filtrarse por categorías:

- Novela
- Ciencia
- Filosofía
- Fantasía

También incluye un buscador dinámico por:

- Nombre del libro
- Autor

-------------------------------

Funcionamiento del carrito

El carrito permite:

- Agregar productos
- Aumentar/disminuir cantidad
- Eliminar productos
- Vaciar carrito
- Calcular total automáticamente

-------------------------------

Catálogo inicial

El proyecto incluye libros famosos como:

- *Cien años de soledad*
- *1984*
- *Cosmos*
- *Dune*
- *Harry Potter*
- *El Señor de los Anillos*

-------------------------------

Eventos utilizados

El proyecto utiliza `addEventListener()` para manejar:

- Clicks
- Inputs de búsqueda
- Botones del carrito
- Filtros de navegación

-------------------------------

Inicialización

La aplicación inicia cuando el DOM termina de cargar:

```js
document.addEventListener("DOMContentLoaded", () => {
  new Tienda(catalogoInicial);
});
```

---

Objetivo del proyecto

Este proyecto fue desarrollado para practicar:

- Manipulación del DOM
- Eventos en JavaScript
- Programación Orientada a Objetos
- Renderizado dinámico
- Gestión de estados simples
- Interacción con interfaces web

-------------------------------

Autor

Proyecto desarrollado como práctica de JavaScript moderno y POO.
