let carrito = loadCarritoDesdeLocalStorage();
let productos = [];
let descuento = 0;

async function cargarProductosDesdeAPI() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    productos = data.map(producto => ({
      ...producto,
      stock: 10
    }));
    guardarProductosLocalStorage();
    mostrarCarrito();
  } catch (error) {
    console.error("Error al cargar productos de la API", error);
  }
}

cargarProductosDesdeAPI();

function loadCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem("carrito");
  return carritoGuardado ? JSON.parse(carritoGuardado) : {};
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function guardarProductosLocalStorage() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function mostrarCarrito() {
  const carritoContainer = document.getElementById("carrito-container");
  carritoContainer.innerHTML = "";
  let totalGeneral = 0;

  if (Object.keys(carrito).length === 0) {
    carritoContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    document.getElementById("total-price").textContent = "Total: $0.00";
    return;
  }

  for (let productoId in carrito) {
    const productoData = carrito[productoId];
    const producto = productos.find(p => p.id == productoId);

    if (!producto) {
      console.error("Producto no encontrado", productoId);
      continue;
    }

    const subtotal = productoData.price * productoData.cantidad;
    totalGeneral += subtotal;

    const productoElement = document.createElement("div");
    productoElement.classList.add("producto");
    productoElement.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="producto-imagen">
      <p><strong>Producto:</strong> ${producto.title}</p>
      <p><strong>Cantidad:</strong> ${productoData.cantidad}</p>
      <p><strong>Precio por unidad:</strong> $${productoData.price.toFixed(2)}</p>
      <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
      <button class="eliminar-producto" data-producto-id="${productoId}">Eliminar</button>
    `;
    carritoContainer.appendChild(productoElement);
  }

  let totalConDescuento = totalGeneral * (1 - descuento);
  const totalPrice = document.getElementById("total-price");
  totalPrice.textContent = `Total: $${totalConDescuento.toFixed(2)}`;

  document.querySelectorAll(".eliminar-producto").forEach(button => {
    button.addEventListener("click", () => {
      const productoId = button.getAttribute("data-producto-id");
      eliminarProductoDelCarrito(productoId);
    });
  });
}

function eliminarProductoDelCarrito(productoId) {
  const cantidadActual = carrito[productoId].cantidad;
  let productosGuardados = JSON.parse(localStorage.getItem("productos"));
  let producto = productosGuardados.find(p => p.id === parseInt(productoId));
  if (!producto) {
    console.error("Producto no encontrado", productoId);
    return;
  }

  let cantidadEliminar = parseInt(prompt(`¿Cuántos ${producto.title} deseas eliminar? (Cantidad actual: ${cantidadActual})`));

  if (isNaN(cantidadEliminar) || cantidadEliminar <= 0 || cantidadEliminar > cantidadActual) {
    alert("Cantidad no válida.");
    return;
  }

  carrito[productoId].cantidad -= cantidadEliminar;

  if (carrito[productoId].cantidad === 0) {
    delete carrito[productoId];
  }

  producto.stock += cantidadEliminar;
  productos = productosGuardados;
  guardarProductosLocalStorage();

  guardarCarritoEnLocalStorage();

  mostrarCarrito();
}

function agregarAlCarrito(productoId) {
  const producto = productos.find(p => p.id === productoId);
  const cantidad = parseInt(prompt("¿Cuántas unidades deseas agregar?"));

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  if (producto.stock < cantidad) {
    alert(`No hay suficiente stock para ${producto.title}. Solo quedan ${producto.stock} unidades.`);
    return;
  }

  carrito[productoId] = carrito[productoId] || { cantidad: 0, price: producto.price, title: producto.title, image: producto.image };
  carrito[productoId].cantidad += cantidad;

  producto.stock -= cantidad;

  guardarCarritoEnLocalStorage();

  mostrarCarrito();
  alert(`${cantidad} unidades de ${producto.title} han sido añadidas al carrito.`);
}

document.getElementById("aplicar-descuento").addEventListener("click", () => {
  const descuentoInput = parseFloat(prompt("Ingresa el porcentaje de descuento (ej. 10 para 10%):"));

  if (isNaN(descuentoInput) || descuentoInput <= 0 || descuentoInput > 100) {
    alert("Por favor, ingresa un porcentaje válido entre 1 y 100.");
    return;
  }

  descuento = descuentoInput / 100;
  mostrarCarrito();
});

document.getElementById("finalizar-compra").addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
    return;
  }

  let totalGeneral = 0;
  for (let productoId in carrito) {
    const productoData = carrito[productoId];
    totalGeneral += productoData.price * productoData.cantidad;
  }

  totalGeneral = totalGeneral * (1 - descuento);

  alert(`El total de tu compra es: $${totalGeneral.toFixed(2)}`);

  let cuotas = parseInt(prompt("¿En cuántas cuotas deseas pagar? (1, 3, 6, 12):"));
  const opcionesCuotas = [1, 3, 6, 12];
  while (!opcionesCuotas.includes(cuotas)) {
    alert("Por favor, selecciona una cantidad de cuotas válida (1, 3, 6 o 12).");
    cuotas = parseInt(prompt("¿En cuántas cuotas deseas pagar? (1, 3, 6, 12):"));
  }

  const montoPorCuota = totalGeneral / cuotas;
  alert(`Has seleccionado ${cuotas} cuotas. Cada cuota será de $${montoPorCuota.toFixed(2)}`);

  if (confirm("¿Confirmas la compra?")) {
    carrito = {}; 
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
    alert("¡Compra realizada con éxito! Gracias por tu compra. 😊");
  }
});