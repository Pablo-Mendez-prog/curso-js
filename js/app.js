const productos = {
  cafe: { id: 1, precio: 135, stock: 10 },
  arroz: { id: 2, precio: 55, stock: 5 },
  fideos: { id: 3, precio: 40, stock: 20 },
};

let carrito = {};

function mostrarProductos() {
  let productList = [];
  for (let nombre in productos) {
    productList.push({
      ID: productos[nombre].id,
      Producto: nombre.charAt(0).toUpperCase() + nombre.slice(1),
      Precio: `$${productos[nombre].precio}`,
      Stock: productos[nombre].stock,
    });
  }
  console.table(productList);
}

function mostrarCarrito() {
  let carritoList = [];
  let total = 0;
  for (let producto in carrito) {
    let subtotal = carrito[producto].cantidad * carrito[producto].precio;
    carritoList.push({
      Producto: producto.charAt(0).toUpperCase() + producto.slice(1),
      Cantidad: carrito[producto].cantidad,
      Subtotal: `$${subtotal.toFixed(2)}`,
    });
    total += subtotal;
  }
  carritoList.push({ Total: `$${total.toFixed(2)}` });
  console.table(carritoList); 
  return total; 
}

function modificarCarrito() {
  mostrarCarrito();
  let productoAEliminar;

  do {
    productoAEliminar = prompt(
      "Escribe el nombre del producto que deseas eliminar del carrito:"
    )
      .trim()
      .toLowerCase();

    if (!carrito[productoAEliminar]) {
      alert(
        "Producto no encontrado en el carrito. Por favor, intenta de nuevo."
      );
      continue;
    }

    let cantidadAEliminar = parseInt(
      prompt(`¿Cuántas unidades de ${productoAEliminar} deseas eliminar?`)
    );

    if (isNaN(cantidadAEliminar) || cantidadAEliminar <= 0) {
      alert("Cantidad no válida. Por favor, ingresa un número positivo.");
      continue;
    }

    if (carrito[productoAEliminar].cantidad < cantidadAEliminar) {
      alert(
        `No puedes eliminar más unidades de las que tienes en el carrito. Solo tienes ${carrito[productoAEliminar].cantidad} unidades.`
      );
      continue;
    }

    carrito[productoAEliminar].cantidad -= cantidadAEliminar;
    productos[productoAEliminar].stock += cantidadAEliminar;

    if (carrito[productoAEliminar].cantidad === 0) {
      delete carrito[productoAEliminar];
      alert(
        `${
          productoAEliminar.charAt(0).toUpperCase() + productoAEliminar.slice(1)
        } ha sido eliminado del carrito.`
      );
    } else {
      alert(
        `${cantidadAEliminar} unidades de ${
          productoAEliminar.charAt(0).toUpperCase() + productoAEliminar.slice(1)
        } han sido eliminadas del carrito.`
      );
    }

    let continuarModificar = preguntarSiNo(
      "¿Deseas eliminar otro producto del carrito? (escribe sí o no):"
    );
    if (!continuarModificar) break;
  } while (true);
}

function calcularTotal() {
  let total = mostrarCarrito();
  let porcentajedescuento;

  do {
    porcentajedescuento = parseFloat(
      prompt("Ingresa el porcentaje de descuento (0 si no hay descuentos):")
    );
    if (
      isNaN(porcentajedescuento) ||
      porcentajedescuento < 0 ||
      porcentajedescuento > 100
    ) {
      alert(
        "Por favor, ingresa un porcentaje de descuento válido entre 0 y 100."
      );
    }
  } while (
    isNaN(porcentajedescuento) ||
    porcentajedescuento < 0 ||
    porcentajedescuento > 100
  );

  let totalConDescuento = total - total * (porcentajedescuento / 100);
  alert(
    `El monto total a pagar es: $${total.toFixed(2)}\n` +
      `Descuento del ${porcentajedescuento}% aplicado.\n` +
      `Total después del descuento: $${totalConDescuento.toFixed(2)}`
  );

  let cantidadCuotas;
  do {
    cantidadCuotas = parseInt(prompt("¿En cuántas cuotas deseas pagar?"));
    if (isNaN(cantidadCuotas) || cantidadCuotas <= 0) {
      alert("Por favor, ingresa un número válido de cuotas.");
    }
  } while (isNaN(cantidadCuotas) || cantidadCuotas <= 0);

  let valorCuota = totalConDescuento / cantidadCuotas;
  alert(
    `Cada cuota será de: $${valorCuota.toFixed(2)} en ${cantidadCuotas} cuotas.`
  );
}

function preguntarSiNo(mensaje) {
  let respuesta;
  do {
    respuesta = prompt(mensaje).trim().toLowerCase();
    if (respuesta !== "si" && respuesta !== "no") {
      alert("Por favor, responde 'sí' o 'no'.");
    }
  } while (respuesta !== "si" && respuesta !== "no");
  return respuesta === "si";
}

function iniciarCompra() {
  let continuar = true;
  while (continuar) {
    mostrarProductos();
    let seleccion;

    do {
      seleccion = prompt(
        "¿Qué producto deseas agregar al carrito? (escribe el nombre)"
      )
        .trim()
        .toLowerCase();

      if (!productos[seleccion]) {
        alert("Producto no válido. Intenta de nuevo.");
      }
    } while (!productos[seleccion]);

    let cantidad;
    do {
      cantidad = parseInt(prompt("¿Cuántas unidades deseas agregar?"));
      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad no válida. Por favor, ingresa un número positivo.");
      } else if (productos[seleccion].stock < cantidad) {
        alert(
          `No hay suficiente stock para ${seleccion}. Solo quedan ${productos[seleccion].stock} unidades.`
        );
      }
    } while (
      isNaN(cantidad) ||
      cantidad <= 0 ||
      productos[seleccion].stock < cantidad
    );

    if (carrito[seleccion]) {
      carrito[seleccion].cantidad += cantidad;
    } else {
      carrito[seleccion] = {
        precio: productos[seleccion].precio,
        cantidad: cantidad,
      };
    }
    productos[seleccion].stock -= cantidad;

    mostrarCarrito();

    let continuarComprando = preguntarSiNo(
      "¿Deseas continuar comprando? (escribe sí o no):"
    );
    if (!continuarComprando) {
      continuar = false;
    } else {
      let modificar = preguntarSiNo(
        "¿Deseas modificar el carrito (eliminar productos)? (escribe sí o no):"
      );
      if (modificar) {
        modificarCarrito();
      }
    }
  }

  calcularTotal();

  alert("Gracias por su compra. ¡Vuelva pronto!");
}

iniciarCompra();
