let productos = []; 


function cargarProductosDeAPI() {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
        mostrarProductos(productos);
    } else {
        
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                productos = data;
                productos.forEach(producto => {
                    producto.stock = 10; 
                });
                
                
                localStorage.setItem("productos", JSON.stringify(productos));
                mostrarProductos(productos);
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }
}


function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = ''; 
    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto', 'p-4', 'rounded-lg', 'shadow-md', 'bg-white', 'text-center');
        productoElement.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-full h-48 object-cover mb-4">
            <h3 class="text-lg font-semibold">${producto.title}</h3>
            <p class="text-gray-600">Precio: $${producto.price}</p>
            <p class="text-sm text-gray-500">Stock disponible: <span id="stock-${producto.id}">${producto.stock}</span></p>
            <input type="number" id="cantidad-${producto.id}" class="p-2 border border-gray-300 rounded mt-2" min="1" max="${producto.stock}" value="1">
            <button class="mt-4 p-2 bg-blue-500 text-white rounded" onclick="agregarAlCarrito(${producto.id})">Añadir al Carrito</button>
        `;
        productosContainer.appendChild(productoElement);
    });
}


function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const cantidadInput = document.getElementById(`cantidad-${productoId}`);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa una cantidad válida.');
        return;
    }

    if (producto.stock < cantidad) {
        alert(`No hay suficiente stock para ${producto.title}. Solo quedan ${producto.stock} unidades.`);
        return;
    }


    let carrito = JSON.parse(localStorage.getItem('carrito')) || {};


    if (carrito[productoId]) {
        carrito[productoId].cantidad += cantidad;
    } else {
        carrito[productoId] = { ...producto, cantidad };
    }


    producto.stock -= cantidad;
    document.getElementById(`stock-${productoId}`).textContent = producto.stock;


    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('productos', JSON.stringify(productos));

    alert(`${cantidad} unidades de ${producto.title} añadidas al carrito.`);
    
    actualizarStockEnPagina();
}


document.getElementById('filtro').addEventListener('input', (e) => {
    const filtroTexto = e.target.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.title.toLowerCase().includes(filtroTexto));
    mostrarProductos(productosFiltrados);
});


document.getElementById('ordenar-precio').addEventListener('click', () => {
    const productosOrdenados = productos.slice().sort((a, b) => a.price - b.price);
    mostrarProductos(productosOrdenados);
});


document.addEventListener('DOMContentLoaded', cargarProductosDeAPI);