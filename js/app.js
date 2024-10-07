const productos = {
    "Cafe": { precio: 135, stock: 10 },
    "Arroz": { precio: 55, stock: 5 },
    "Fideos": { precio: 40, stock: 20 },
};

function mostrarProductos() {
    let productList = "Selecciona un producto:\n";
    for (let nombre in productos) {
        productList += `${nombre} - Precio: $${productos[nombre].precio} - Stock: ${productos[nombre].stock}\n`;
    }
    return productList;
}

function calcularTotal(cantidadTotal) {
    let total = cantidadTotal;
    let porcentajedescuento = parseFloat(prompt("Ingresa el porcentaje de descuento (0 si no hay descuentos):"));
    if (isNaN(porcentajedescuento) || porcentajedescuento < 0 || porcentajedescuento > 100) {
        alert("Por favor, ingresa un porcentaje de descuento válido entre 0 y 100.");
        return;
    }
    let totalConDescuento = total - (total * (porcentajedescuento / 100));
    alert(`El monto total a pagar es: $${total.toFixed(2)}\n` +
        `Descuento del ${porcentajedescuento}% aplicado.\n` +
        `Total después del descuento: $${totalConDescuento.toFixed(2)}`);
    let cantidadCuotas = parseInt(prompt("¿En cuántas cuotas deseas pagar?"));
    if (isNaN(cantidadCuotas) || cantidadCuotas <= 0) {
        alert("Por favor, ingresa un número válido de cuotas.");
        return;
    }
    let valorCuota = totalConDescuento / cantidadCuotas;
    alert(`Cada cuota será de: $${valorCuota.toFixed(2)} en ${cantidadCuotas} cuotas.`);
}

function iniciarCompra() {
    let continuar = true;
    let totalCompra = 0;
    while (continuar) {
        let productosSeleccionados = mostrarProductos();
        let seleccion = prompt(`${productosSeleccionados}¿Qué producto deseas comprar? (escribe el nombre)`).trim();
        if (productos[seleccion]) {
            let cantidad = parseInt(prompt("¿Cuántas unidades deseas?"));
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Cantidad no válida. Por favor, ingresa un número positivo.");
                continue;
            }
            if (productos[seleccion].stock < cantidad) {
                alert(`No hay suficiente stock para ${seleccion}. Solo quedan ${productos[seleccion].stock} unidades.`);
                continue;
            }
            totalCompra += productos[seleccion].precio * cantidad;
            productos[seleccion].stock -= cantidad;
        } else {
            alert("Producto no válido. Intenta de nuevo.");
            continue;
        }
        continuar = confirm("¿Deseas continuar comprando? Presiona 'Aceptar' para continuar o 'Cancelar' para finalizar.");
    }
    calcularTotal(totalCompra);
}

iniciarCompra();



no me anda git