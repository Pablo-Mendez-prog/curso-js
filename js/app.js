const productos = {
  cafe: { id: 1, precio: 135, stock: 110, imagen : "https://http2.mlstatic.com/D_NQ_NP_741152-MLU77760655647_072024-O.webp" },
  arroz: { id: 2, precio: 55, stock: 80 },
  fideos: { id: 3, precio: 40, stock: 90 },
  harina: { id: 4, precio: 40, stock: 50 },
  azucar: { id: 5, precio: 45, stock: 100 },
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