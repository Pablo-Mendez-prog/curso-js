document.addEventListener("DOMContentLoaded", () => {
  let carrito = loadCarritoDesdeLocalStorage();
  mostrarCarrito();
  function loadCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : {};
  }
  function mostrarCarrito() {
    const carritoContainer = document.getElementById("carrito-container");
    carritoContainer.innerHTML = "";
    let total = 0;
    for (let producto in carrito) {
      const productoData = carrito[producto];
      const subtotal = productoData.precio * productoData.cantidad;
      total += subtotal;
      const productoElement = document.createElement("div");
      productoElement.classList.add("producto");
      productoElement.innerHTML = `
                <p>Producto: ${
                producto.charAt(0).toUpperCase() + producto.slice(1)
                }</p>
                <p>Cantidad: ${productoData.cantidad}</p>
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <button class="eliminar-producto" data-producto="${producto}">Eliminar</button>
            `;
      carritoContainer.appendChild(productoElement);
    }
    const totalPrice = document.getElementById("total-price");
    totalPrice.textContent = `Total: $${total.toFixed(2)}`;
    document.querySelectorAll(".eliminar-producto").forEach((button) => {
      button.addEventListener("click", () => {
        const productoNombre = button.getAttribute("data-producto");
        eliminarProductoDelCarrito(productoNombre);
      });
    });
  }
  function eliminarProductoDelCarrito(producto) {
    const cantidadActual = carrito[producto].cantidad;
    let cantidadEliminar = parseInt(prompt(`¿Cuántos ${producto} desea eliminar? (Cantidad actual: ${cantidadActual})`));
    if (
      !isNaN(cantidadEliminar) &&
      cantidadEliminar > 0 &&
      cantidadEliminar <= cantidadActual
    ) {
      carrito[producto].cantidad -= cantidadEliminar;
      if (carrito[producto].cantidad === 0) {
        delete carrito[producto];
      }
      guardarCarritoEnLocalStorage();
      mostrarCarrito();
    } else {
      alert("Por favor, ingrese una cantidad válida.");
    }
  }
  function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  document.getElementById("aplicar-descuento").addEventListener("click", () => {
    const descuento = parseFloat(prompt("Ingrese el porcentaje de descuento:"));
    if (isNaN(descuento) || descuento < 0 || descuento > 100) {
      alert("Por favor, ingrese un porcentaje de descuento válido (entre 0 y 100).");}{
      const totalElement = document.getElementById("total-price");
      const total = parseFloat(totalElement.textContent.replace("Total: $", ""));
  const totalConDescuento = total - total * (descuento / 100);
  totalElement.textContent = `Total con descuento: $${totalConDescuento.toFixed(2)}`;
}});

  document.getElementById("finalizar-compra").addEventListener("click", () => {
    const totalElement = document.getElementById("total-price");
    const total = parseFloat(
      totalElement.textContent
        .replace("Total: $", "")
        .replace("Total con descuento: $", "")
    );
    const cuotas = parseInt(
      prompt("¿En cuántas cuotas desea pagar? (Disponible 3, 6 o 12 cuotas)")
    );
    if (cuotas === 3 || cuotas === 6 || cuotas === 12) {
      const cuotaMensual = total / cuotas;
      alert(
        `Tu pago será en ${cuotas} cuotas de $${cuotaMensual.toFixed(
          2
        )} cada una.`
      );

      alert("Gracias por tu compra. ¡Tu pedido está en proceso!");
      localStorage.removeItem("carrito");
      carrito = {};
      mostrarCarrito();
    } else {
      alert("Por favor, elija una opción de cuotas válida (3, 6 o 12).");
    }
  });
});
