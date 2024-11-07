const productos = {
  cafe: { id: 1, precio: 135, stock: 110 },
  arroz: { id: 2, precio: 55, stock: 80 },
  fideos: { id: 3, precio: 40, stock: 90 },
  harina: { id: 4, precio: 40, stock: 50 },
  azucar: { id: 5, precio: 45, stock: 100 },
  leche: { id: 6, precio: 95, stock: 120 },
  aceite: { id: 7, precio: 180, stock: 70 },
  pan: { id: 8, precio: 60, stock: 150 },
  galletitas: { id: 9, precio: 100, stock: 200 },
  jugo: { id: 10, precio: 70, stock: 65 },
  detergente: { id: 11, precio: 120, stock: 40 },
  pasta_dental: { id: 12, precio: 75, stock: 50 },
  shampoo: { id: 13, precio: 130, stock: 30 },
  sal: { id: 14, precio: 35, stock: 180 },
  mostaza: { id: 15, precio: 65, stock: 110 },
  ketchup: { id: 16, precio: 95, stock: 85 },
  mayonesa: { id: 17, precio: 85, stock: 95 },
  jamon: { id: 18, precio: 220, stock: 50 },
  queso: { id: 19, precio: 280, stock: 60 },
  pasta: { id: 20, precio: 50, stock: 120 },
  pollo: { id: 21, precio: 250, stock: 40 },
  carne: { id: 22, precio: 450, stock: 30 },
  verduras: { id: 23, precio: 100, stock: 150 },
  frutas: { id: 24, precio: 120, stock: 100 },
  yogurt: { id: 25, precio: 120, stock: 80 },
  miel: { id: 26, precio: 180, stock: 60 },
  queso_cremoso: { id: 27, precio: 350, stock: 25 },
  papas_fritas: { id: 28, precio: 95, stock: 110 },
  chocolate: { id: 29, precio: 140, stock: 75 },
  helado: { id: 30, precio: 250, stock: 50 },
  cereales: { id: 31, precio: 160, stock: 70 },
  frutos_secos: { id: 32, precio: 200, stock: 40 },
  agua: { id: 33, precio: 45, stock: 200 },
  refrescos: { id: 34, precio: 100, stock: 80 },
  salsa_soja: { id: 35, precio: 65, stock: 110 },
  vinagre: { id: 36, precio: 50, stock: 130 },
  limpiador: { id: 37, precio: 110, stock: 50 },
  suavizante: { id: 38, precio: 130, stock: 60 },
  papel_higienico: { id: 39, precio: 80, stock: 150 },
  servilletas: { id: 40, precio: 40, stock: 200 },
  desinfectante: { id: 41, precio: 100, stock: 90 },
  aceite_oliva: { id: 42, precio: 220, stock: 40 },
  conservas: { id: 43, precio: 80, stock: 70 },
  arroz_integral: { id: 44, precio: 75, stock: 50 },
  lentejas: { id: 45, precio: 60, stock: 60 },
  garbanzos: { id: 46, precio: 65, stock: 80 },
  atún: { id: 47, precio: 150, stock: 45 },
  sardinas: { id: 48, precio: 120, stock: 55 },
  galletas_saladas: { id: 49, precio: 90, stock: 130 },
  mermelada: { id: 50, precio: 120, stock: 40 }
};

function actualizarCarrito(producto, cantidad) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

  if (carrito[producto]) {
    carrito[producto].cantidad += cantidad;
  } else {
    carrito[producto] = {
      precio: productos[producto].precio,
      cantidad: cantidad,
    };
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  productos[producto].stock -= cantidad;

  actualizarStockEnPagina();
}


function actualizarStockEnPagina() {
  const productosDisponibles = document.querySelectorAll(".producto");
  productosDisponibles.forEach((productoElemento) => {
    const productoNombre = productoElemento.dataset.producto;
    const stockElemento = productoElemento.querySelector(".stock");
    stockElemento.textContent = `Stock disponible: ${productos[productoNombre].stock}`;
  });
}


function agregarAlCarrito(producto) {
  const cantidad = parseInt(prompt("¿Cuántas unidades deseas agregar?"));

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  if (productos[producto].stock < cantidad) {
    alert(
      `No hay suficiente stock para ${producto}. Solo quedan ${productos[producto].stock} unidades.`
    );
    return;
  }

  actualizarCarrito(producto, cantidad);

  alert(
    `${cantidad} unidades de ${producto.charAt(0).toUpperCase() + producto.slice(1)} han sido añadidas al carrito.`
  );
}


function mostrarProductos(productosOrdenados) {
  const productosContainer = document.getElementById("productos-container");
  productosContainer.innerHTML = "";  

  productosOrdenados.forEach(([producto, productoData]) => {
    const divProducto = document.createElement("div");
    divProducto.classList.add("producto", "p-4", "rounded-lg", "shadow-md", "bg-white", "text-center");
    divProducto.dataset.producto = producto;

    divProducto.innerHTML = `
      <h3 class="text-lg font-semibold">${producto.charAt(0).toUpperCase() + producto.slice(1)}</h3>
      <p class="text-gray-600">Precio: $${productoData.precio}</p>
      <p class="stock text-sm text-gray-500">Stock disponible: ${productoData.stock}</p>
      <button class="mt-4 p-2 bg-blue-500 text-white rounded" onclick="agregarAlCarrito('${producto}')">Añadir al Carrito</button>
    `;
    productosContainer.appendChild(divProducto);
  });
}


function ordenarProductosPorPrecio() {
  const productosOrdenados = Object.entries(productos)
    .sort((a, b) => a[1].precio - b[1].precio);

  mostrarProductos(productosOrdenados);
}


function filtrarProductos() {
  const query = document.getElementById("filtro").value.toLowerCase();

  const productosFiltrados = Object.entries(productos).filter(([producto, productoData]) => {
    return producto.toLowerCase().includes(query);
  });

  mostrarProductos(productosFiltrados);
}


document.getElementById("ordenar-precio").addEventListener("click", ordenarProductosPorPrecio);
document.getElementById("filtro").addEventListener("input", filtrarProductos);


window.onload = function () {
  mostrarProductos(Object.entries(productos));
};