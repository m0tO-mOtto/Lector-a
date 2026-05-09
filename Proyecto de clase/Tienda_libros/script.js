"use strict";


class Producto {
  /**
   * @param {object} datos
   */
  constructor({ id, nombre, autor, precio, emoji, categoria, descripcion }) {
    this.id          = id;
    this.nombre      = nombre;
    this.autor       = autor;
    this.precio      = precio;        
    this.emoji       = emoji;         
    this.categoria   = categoria;     // 'novela' | 'ciencia' | 'filosofia' | 'fantasia'
    this.descripcion = descripcion;
  }

  get precioFormateado() {
    return `$${this.precio.toFixed(2)}`;
  }
}

class Carrito {
  constructor() {
    /** @type {Array<{producto: Producto, cantidad: number}>} */
    this.items = [];
  }

  /**
 .
   @param {Producto} producto
   @param {number} cantidad
   */
  agregarProducto(producto, cantidad = 1) {
    const existente = this.items.find(i => i.producto.id === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
  }

  /**

   @param {number} id 
   */
  eliminarProducto(id) {
    this.items = this.items.filter(i => i.producto.id !== id);
  }

  /**
  
    @param {number} id
    @param {number} delta - +1 o -1
   */
  cambiarCantidad(id, delta) {
    const item = this.items.find(i => i.producto.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) this.eliminarProducto(id);
  }

 
  calcularTotal() {
    return this.items.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0);
  }


  contarItems() {
    return this.items.reduce((suma, i) => suma + i.cantidad, 0);
  }


  vaciarCarrito() {
    this.items = [];
  }

  /**
   * Genera el HTML del panel de carrito y lo inyecta en el DOM.
   * @param {HTMLElement} contenedor
   * @param {HTMLElement} totalEl
   * @param {HTMLElement} countEl
   */
  renderizar(contenedor, totalEl, countEl) {
  
    const total = this.contarItems();
    countEl.textContent = total;
    countEl.classList.add("bump");
    setTimeout(() => countEl.classList.remove("bump"), 200);

  
    totalEl.textContent = `$${this.calcularTotal().toFixed(2)}`;

    // Vaciar contenedor
    contenedor.innerHTML = "";

    if (this.items.length === 0) {
      contenedor.innerHTML = `<p class="cart__empty">Tu carrito está vacío 📖</p>`;
      return;
    }

    this.items.forEach(({ producto, cantidad }) => {
      const div = document.createElement("div");
      div.className = "cart__item";
      div.dataset.id = producto.id;
      div.innerHTML = `
        <div class="cart__item-emoji">${producto.emoji}</div>
        <div class="cart__item-info">
          <div class="cart__item-name">${producto.nombre}</div>
          <div class="cart__item-meta">${producto.autor}</div>
          <div class="cart__item-meta">${producto.precioFormateado} c/u</div>
        </div>
        <div class="cart__item-actions">
          <span class="cart__item-price">$${(producto.precio * cantidad).toFixed(2)}</span>
          <div class="qty-ctrl">
            <button class="qty-btn" data-action="dec" data-id="${producto.id}" aria-label="Quitar uno">−</button>
            <span class="qty-val">${cantidad}</span>
            <button class="qty-btn" data-action="inc" data-id="${producto.id}" aria-label="Agregar uno">+</button>
          </div>
          <button class="cart__remove" data-action="del" data-id="${producto.id}" aria-label="Eliminar">✕ quitar</button>
        </div>
      `;
      contenedor.appendChild(div);
    });
  }
}


class Tienda {
  constructor(productos) {
    /** @type {Producto[]} */
    this.catalogo   = productos;
    this.carrito    = new Carrito();
    this.filtroActivo = "todos";
    this.busqueda     = "";

    
    this.catalogoEl  = document.getElementById("catalog");
    this.emptyMsg    = document.getElementById("emptyMsg");
    this.cartPanel   = document.getElementById("cart");
    this.cartItems   = document.getElementById("cartItems");
    this.cartTotal   = document.getElementById("cartTotal");
    this.cartCount   = document.getElementById("cartCount");
    this.cartToggle  = document.getElementById("cartToggle");
    this.cartClose   = document.getElementById("cartClose");
    this.clearBtn    = document.getElementById("clearBtn");
    this.checkoutBtn = document.getElementById("checkoutBtn");
    this.overlay     = document.getElementById("overlay");
    this.searchInput = document.getElementById("searchInput");
    this.toastEl     = document.getElementById("toast");

    this._initEventos();
    this.renderCatalogo();
  }



  _productosFiltrados() {
    return this.catalogo.filter(p => {
      const pasaCat    = this.filtroActivo === "todos" || p.categoria === this.filtroActivo;
      const terminoBus = this.busqueda.toLowerCase();
      const pasaBus    = !terminoBus
        || p.nombre.toLowerCase().includes(terminoBus)
        || p.autor.toLowerCase().includes(terminoBus);
      return pasaCat && pasaBus;
    });
  }

  

  renderCatalogo() {
    const lista = this._productosFiltrados();
    this.catalogoEl.innerHTML = "";
    this.emptyMsg.hidden = lista.length > 0;

    lista.forEach((prod, i) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.animationDelay = `${i * 50}ms`;
      card.innerHTML = `
        <div class="card__cover">
          <span class="card__badge">${prod.categoria}</span>
          ${prod.emoji}
        </div>
        <div class="card__body">
          <div class="card__title">${prod.nombre}</div>
          <div class="card__author">${prod.autor}</div>
          <div class="card__price">${prod.precioFormateado}</div>
        </div>
        <button class="card__add" data-id="${prod.id}">
          + Agregar al carrito
        </button>
      `;
      this.catalogoEl.appendChild(card);
    });
  }

  

  _renderCarrito() {
    this.carrito.renderizar(this.cartItems, this.cartTotal, this.cartCount);
  }

  

  _abrirCarrito() {
    this.cartPanel.classList.add("open");
    this.cartPanel.setAttribute("aria-hidden", "false");
    this.overlay.classList.add("show");
  }

  _cerrarCarrito() {
    this.cartPanel.classList.remove("open");
    this.cartPanel.setAttribute("aria-hidden", "true");
    this.overlay.classList.remove("show");
  }

  

  _mostrarToast(msg) {
    this.toastEl.textContent = msg;
    this.toastEl.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this.toastEl.classList.remove("show"), 2500);
  }

  

  _initEventos() {
    
    this.catalogoEl.addEventListener("click", e => {
      const btn = e.target.closest(".card__add");
      if (!btn) return;
      const prod = this.catalogo.find(p => p.id === +btn.dataset.id);
      if (!prod) return;
      this.carrito.agregarProducto(prod);
      this._renderCarrito();
      this._mostrarToast(`📚 "${prod.nombre}" agregado`);
    });

    
    this.cartItems.addEventListener("click", e => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = +btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "inc") this.carrito.cambiarCantidad(id, +1);
      if (action === "dec") this.carrito.cambiarCantidad(id, -1);
      if (action === "del") this.carrito.eliminarProducto(id);
      this._renderCarrito();
    });

    
    this.cartToggle.addEventListener("click", () => this._abrirCarrito());
    this.cartClose.addEventListener("click",  () => this._cerrarCarrito());
    this.overlay.addEventListener("click",    () => this._cerrarCarrito());

  
    this.clearBtn.addEventListener("click", () => {
      this.carrito.vaciarCarrito();
      this._renderCarrito();
      this._mostrarToast("🗑️ Carrito vaciado");
    });

  
    this.checkoutBtn.addEventListener("click", () => {
      if (this.carrito.items.length === 0) {
        this._mostrarToast("⚠️ Tu carrito está vacío");
        return;
      }
      const total = this.carrito.calcularTotal().toFixed(2);
      this._cerrarCarrito();
      this.carrito.vaciarCarrito();
      this._renderCarrito();
      this._mostrarToast(`✅ ¡Compra realizada! Total: $${total}`);
    });

   
    document.querySelectorAll(".nav__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".nav__btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filtroActivo = btn.dataset.cat;
        this.renderCatalogo();
      });
    });

    
    this.searchInput.addEventListener("input", e => {
      this.busqueda = e.target.value;
      this.renderCatalogo();
    });
  }
}


const catalogoInicial = [
  new Producto({ id:1,  nombre:"Cien años de soledad",     autor:"Gabriel García Márquez", precio:180.000, emoji:"📗", categoria:"novela",    descripcion:"Obra cumbre del realismo mágico." }),
  new Producto({ id:2,  nombre:"El nombre de la rosa",      autor:"Umberto Eco",            precio:165.000, emoji:"📕", categoria:"novela",    descripcion:"Misterio en un monasterio medieval." }),
  new Producto({ id:3,  nombre:"1984",                      autor:"George Orwell",          precio:130.000, emoji:"📘", categoria:"novela",    descripcion:"Distopía totalitaria." }),
  new Producto({ id:4,  nombre:"Una breve historia del tiempo", autor:"Stephen Hawking",   precio:220.000, emoji:"🌌", categoria:"ciencia",   descripcion:"El universo explicado para todos." }),
  new Producto({ id:5,  nombre:"El gen egoísta",            autor:"Richard Dawkins",        precio:150.000, emoji:"🧬", categoria:"ciencia",   descripcion:"La biología evolutiva desde otra mirada." }),
  new Producto({ id:6,  nombre:"Cosmos",                    autor:"Carl Sagan",             precio:240.000, emoji:"🔭", categoria:"ciencia",   descripcion:"Un viaje por el universo." }),
  new Producto({ id:7,  nombre:"El mundo de Sofía",         autor:"Jostein Gaarder",        precio:150.000, emoji:"🦉", categoria:"filosofia", descripcion:"Historia de la filosofía occidental." }),
  new Producto({ id:8,  nombre:"Así habló Zaratustra",      autor:"Friedrich Nietzsche",    precio:140.000, emoji:"⚡", categoria:"filosofia", descripcion:"La voluntad de poder y el superhombre." }),
  new Producto({ id:9,  nombre:"El Señor de los Anillos",   autor:"J.R.R. Tolkien",        precio:320.000, emoji:"💍", categoria:"fantasia",  descripcion:"La épica tolkieniana por excelencia." }),
  new Producto({ id:10, nombre:"Harry Potter y la piedra filosofal", autor:"J.K. Rowling", precio:170.000, emoji:"⚗️", categoria:"fantasia",  descripcion:"El inicio de una saga legendaria." }),
  new Producto({ id:11, nombre:"Dune",                      autor:"Frank Herbert",          precio:200.000, emoji:"🏜️", categoria:"fantasia",  descripcion:"Política y ecología en un planeta desértico." }),
  new Producto({ id:12, nombre:"Meditations",               autor:"Marco Aurelio",          precio:120.000, emoji:"🏛️", categoria:"filosofia", descripcion:"Reflexiones del emperador estoico." }),
];

document.addEventListener("DOMContentLoaded", () => {
  new Tienda(catalogoInicial);
});
