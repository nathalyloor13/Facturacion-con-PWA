import { inicializarModuloClientes } from "./main/clientesMain.js";
import { inicializarModuloProductos } from "./main/productosMain.js";
import { inicializarModuloFacturas } from "./main/facturasMain.js";

document.addEventListener("DOMContentLoaded", () => {
  const enlacesMenu = document.querySelectorAll("nav.menu-navegacion a");
  const contenedorPrincipal = document.querySelector(".contenedor-principal");
  let panelDinamico = document.getElementById("panel-dinamico");

  if (!panelDinamico) {
    panelDinamico = document.createElement("div");
    panelDinamico.id = "panel-dinamico";
    panelDinamico.classList.add("panel-dinamico");
    contenedorPrincipal.appendChild(panelDinamico);
  }

  function cargarContenido(seccion) {
    switch (seccion) {
      case "clientes":
        panelDinamico.innerHTML = `
          <h2>Gestión de Clientes</h2>
          <form id="formCliente">
            <input type="text" id="nombreCliente" placeholder="Nombre" required />
            <input type="text" id="cedulaCliente" placeholder="Cédula" required />
            <input type="text" id="direccionCliente" placeholder="Dirección" required />
            <button type="submit">Guardar Cliente</button>
            <button type="button" id="btnRecargarClientes">RELOAD</button>
          </form>

          <h3>Listado de Clientes</h3>
          <table id="tablaClientes">
            <thead>
              <tr><th>Nombre</th><th>Cédula</th><th>Dirección</th><th>Acciones</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        `;
        if (typeof inicializarModuloClientes === "function") {
          inicializarModuloClientes();
        }
        break;

      case "productos":
        panelDinamico.innerHTML = `
          <h2>Gestión de Productos</h2>
          <form id="formProducto">
            <input type="text" id="nombreProducto" placeholder="Nombre del producto" required />
            <input type="number" step="0.01" id="precioProducto" placeholder="Precio" required />
            <button type="submit">Guardar Producto</button>
          </form>
          <h3>Listado de Productos</h3>
          <table id="tablaProductos">
            <thead>
              <tr><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        `;
        if (typeof inicializarModuloProductos === "function") {
          inicializarModuloProductos();
        }
        break;

      case "facturacion":
        panelDinamico.innerHTML = `
          <h2>Generar Factura</h2>
          <form id="formFactura">
            <select id="clienteFactura" required>
              <option value="">Seleccionar Cliente</option>
            </select>

            <div id="productosContainer">
              <div class="grupo-producto">
                <input type="text" class="producto" placeholder="Producto" required />
                <input type="number" class="cantidad" placeholder="Cantidad" required />
                <input type="number" class="precio" placeholder="Precio Unitario (con IVA)" required />
              </div>
            </div>

            <div class="controles-productos">
              <button type="button" id="btnAgregarFila">+</button>
              <button type="button" id="btnEliminarFila" disabled>-</button>
            </div>

            <button type="submit">Generar Factura</button>
          </form>

          <h3>Factura Generada</h3>
          <div id="resultadoFactura"></div>

          <h3>Historial de Facturas</h3>
          <button type="button" id="btnVerFacturas">Ver facturas guardadas</button>
          <div id="historialFacturas"></div>
        `;
        if (typeof inicializarModuloFacturas === "function") {
          inicializarModuloFacturas();
        }
        break;

      default:
        panelDinamico.innerHTML = `<p>Sección no reconocida.</p>`;
    }
  }

  enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const seccion = enlace.getAttribute("data-seccion");
      cargarContenido(seccion);
    });
  });
});