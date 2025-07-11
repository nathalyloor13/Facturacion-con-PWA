import { obtenerTodosLosClientes } from "../modulos/clientes.js";
import { agregarFactura, obtenerTodasLasFacturas } from "../modulos/facturas.js";

function inicializarModuloFacturas() {
  const productosContainer = document.getElementById("productosContainer");
  const btnAgregarFila = document.getElementById("btnAgregarFila");
  const btnEliminarFila = document.getElementById("btnEliminarFila");
  const formFactura = document.getElementById("formFactura");
  const resultadoFactura = document.getElementById("resultadoFactura");
  const btnVerFacturas = document.getElementById("btnVerFacturas");
  const historialContainer = document.getElementById("historialFacturas");

  // Obtener y rellenar opciones del <select> cliente
  const selectCliente = document.getElementById("clienteFactura");
  const clientes = obtenerTodosLosClientes();

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Seleccionar Cliente";
  selectCliente.appendChild(optionDefault);

  clientes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = `${c.nombre} (${c.cedula})`;
    selectCliente.appendChild(option);
  });

  // Estado inicial de botones
  actualizarEstadoBotones();

  btnAgregarFila.addEventListener("click", () => {
    const grupos = productosContainer.querySelectorAll(".grupo-producto");
    if (grupos.length < 5) {
      const nuevaFila = document.createElement("div");
      nuevaFila.className = "grupo-producto";
      nuevaFila.innerHTML = `
        <input type="text" class="producto" placeholder="Producto" required />
        <input type="number" class="cantidad" placeholder="Cantidad" required />
        <input type="number" class="precio" placeholder="Precio Unitario (con IVA)" required />
      `;
      productosContainer.appendChild(nuevaFila);
    }
    actualizarEstadoBotones();
  });

  btnEliminarFila.addEventListener("click", () => {
    const grupos = productosContainer.querySelectorAll(".grupo-producto");
    if (grupos.length > 1) {
      productosContainer.removeChild(grupos[grupos.length - 1]);
    }
    actualizarEstadoBotones();
  });

  function actualizarEstadoBotones() {
    const totalFilas = productosContainer.querySelectorAll(".grupo-producto").length;
    btnEliminarFila.disabled = totalFilas <= 1;
    btnAgregarFila.disabled = totalFilas >= 5;
  }

  formFactura.addEventListener("submit", function (e) {
    e.preventDefault();

    const clienteId = parseInt(selectCliente.value);
    const filas = productosContainer.querySelectorAll(".grupo-producto");

    if (!clienteId) {
      alert("Seleccione un cliente.");
      return;
    }

    const productos = [];
    let filasHTML = "";
    let subtotal = 0;
    let iva = 0;
    let total = 0;

    filas.forEach(fila => {
      const nombre = fila.querySelector(".producto").value;
      const cantidad = parseInt(fila.querySelector(".cantidad").value);
      const precioFinal = parseFloat(fila.querySelector(".precio").value); // Precio con IVA incluido

      const precioSinIVA = precioFinal / 1.12;
      const ivaUnitario = precioFinal - precioSinIVA;

      const subtotalFila = precioSinIVA * cantidad;
      const ivaFila = ivaUnitario * cantidad;
      const totalFila = precioFinal * cantidad;

      subtotal += subtotalFila;
      iva += ivaFila;
      total += totalFila;

      productos.push({ idProducto: nombre, cantidad, precio: precioFinal });

      filasHTML += `
        <tr>
          <td>${nombre}</td>
          <td>${cantidad}</td>
          <td>$${precioFinal.toFixed(2)}</td>
          <td>$${subtotalFila.toFixed(2)}</td>
        </tr>
      `;
    });

    const clienteSeleccionado = clientes.find(c => c.id === clienteId);
    const cliente = {
      id: clienteId,
      nombre: clienteSeleccionado.nombre,
      cedula: clienteSeleccionado.cedula
    };

    const totales = {
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2)
    };

    const factura = agregarFactura(cliente, productos, totales);

    resultadoFactura.innerHTML = `
      <div class="factura">
        <h4>Factura</h4>
        <p><strong>Cliente:</strong> ${cliente.nombre} (${cliente.cedula})</p>
        <p><strong>Fecha:</strong> ${factura.fecha}</p>
        <table class="tabla-factura">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Final</th>
              <th>Subtotal sin IVA</th>
            </tr>
          </thead>
          <tbody>
            ${filasHTML}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>IVA (12%)</strong></td>
              <td>$${iva.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>$${total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  });

  // Mostrar historial de facturas guardadas
  btnVerFacturas.addEventListener("click", () => {
    const facturas = obtenerTodasLasFacturas();

    if (facturas.length === 0) {
      historialContainer.innerHTML = "<p>No hay facturas guardadas.</p>";
      return;
    }

    let tablaHTML = `
      <table class="tabla-historial">
        <thead>
          <tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th></tr>
        </thead>
        <tbody>
    `;

    facturas.forEach(f => {
      tablaHTML += `
        <tr>
          <td>${f.id}</td>
          <td>${f.cliente.nombre} (${f.cliente.cedula})</td>
          <td>${f.fecha}</td>
          <td>$${f.totales.total}</td>
        </tr>
      `;
    });

    tablaHTML += "</tbody></table>";
    historialContainer.innerHTML = tablaHTML;
  });
}

export { inicializarModuloFacturas };
