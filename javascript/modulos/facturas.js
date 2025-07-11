
// Obtener todas las facturas
function obtenerTodasLasFacturas() {
const data = localStorage.getItem("facturas");
return data ? JSON.parse(data) : [];
}
// Guardar facturas en localStorage
function guardarFacturas(facturas) {
  localStorage.setItem("facturas", JSON.stringify(facturas));
}

// Crear una nueva factura
function agregarFactura(cliente, productos, totales) {
  let facturas = obtenerTodasLasFacturas();

  // Calcular nuevo ID
  const maxId = facturas.reduce((max, f) => Math.max(max, f.id || 0), 0);
  const nuevoId = maxId + 1;

  // Construir estructura de factura completa
  const factura = {
    id: nuevoId,
    cliente,        // { id, nombre, cedula }
    productos,      // [{ idProducto, cantidad, precio }]
    totales,        // { subtotal, iva, total }
    fecha: new Date().toISOString().split("T")[0]
  };

  facturas.push(factura);
  guardarFacturas(facturas);

  console.log("Factura creada con ID:", nuevoId);
  return factura;
}

// Obtener una factura por ID
function obtenerFacturaPorId(id) {
  const facturas = obtenerTodasLasFacturas();
  return facturas.find(f => f.id === id);
}

// Eliminar una factura por ID
function eliminarFactura(id) {
  let facturas = obtenerTodasLasFacturas();
  facturas = facturas.filter(f => f.id !== id);
  guardarFacturas(facturas);
  console.log("Factura eliminada:", id);
}

// Eliminar todas las facturas
function limpiarFacturas() {
  localStorage.removeItem("facturas");
  console.log("Todas las facturas han sido eliminadas.");
}

export {
  obtenerTodasLasFacturas,
  agregarFactura,
  obtenerFacturaPorId,
  eliminarFactura,
  limpiarFacturas
};