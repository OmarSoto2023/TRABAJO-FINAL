//importar
import { bdProductos } from "./products_cont.js";
import { bdFPago } from "./pagos_cont.js";
import { bdUsuariosInt } from "./users_cont.js";

const linkProductos = document.getElementById('nav-productos');
const linkOfertas = document.getElementById('nav-ofertas');

const carrito = document.querySelector(".carrito");

const usuarioLogin = document.querySelector('.user-login-off');
const cerrarSesion = document.querySelector('#cierre-sesion');
const nombreUser = document.querySelector('.nombre-user-login');

const totalesCarrito = document.querySelector(".totales-carrito");

const textoAlternativo = document.getElementById('texto-alternativo');
const cantidadProdEncontrados = document.getElementById('total-productos');
const textoABuscar = document.querySelector("#texto-filtro");
const buscarProducto = document.querySelector("#buscar");
const tipoFiltro = document.querySelector("#tipo-filtro");

const seccionProductos = document.getElementById("productos");

const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modal-container");
const modalContainerTitulo = document.querySelector(".modal-container-titulo");
const cerrarModal = document.querySelector(".modal-close");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const finalizarCompra = document.querySelector("#finalizar-compra");

const modalFinCompra = document.querySelector(".modal-fincompra");
const cerrarFinCompra = document.querySelector(".close-fincompra");
const volverAlCarrito = document.querySelector(".volver-carrito");
const selectFPago = document.querySelector(".formapago");
const finalizarPago = document.querySelector(".finalizar-pago");

const carritoFijo = document.querySelector(".carrito-fijo");

const modalLogin = document.querySelector(".modal-login");
const usuarioEmail = document.getElementById('login-email');
const usuarioClave = document.getElementById('login-clave');
const buttonLogin = document.getElementById('button-login');
const errorLogin = document.getElementById('errorLog');
const crearCuenta = document.getElementById('crearCuenta');

const modalNuevoUsuario = document.querySelector(".modal-nuevoUsuario");
const buttonNuevoUsuario = document.querySelector(".button-nuevoUsuario");
const nuevoUsuarioEmail = document.querySelector("#nuevoUsuario-email");
const errorNuevoUsuario = document.querySelector('#errorLog-nuevoUsuario');
const nuevoUsuarioNombre = document.querySelector('#nuevoUsuario-nombre');
const nuevoUsuarioClave = document.querySelector('#nuevoUsuario-clave');
const nuevoUsuarioReIngreseClave = document.querySelector('#nuevoUsuario-reIngreseClave');

export const totalProductos = [...bdProductos];
let miCarrito = [];
let totalFinalCarrito = 0;
let cantCuota = 0;
let importeCuota = 0;
let blnModalFinalizarCompra = false;

const regexEMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const regexApellidoNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s'-]+$/;

class CarritoCompra {
    constructor(codigo, nombre, cantidad, precio) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
    }
    
    getCodigo = function () {
        return this.codigo;
    }
    getNombre = function () {
        return this.nombre;
    }
    getCantidad = function () {
        return this.cantidad;
    }
    getPrecio = function () {
        return this.precio;
    }
    setCantidad = function (cantidad) {
        this.cantidad = cantidad;
    }
};

export const cargaCarritoLS = () => {
    const micarritoLS = JSON.parse(localStorage.getItem('micarrito')) || [];
    micarritoLS.forEach((el) => {
        miCarrito.push(new CarritoCompra(el.codigo, el.nombre, el.cantidad, el.precio));
    }); -carrito - 1
    actualizaTotalesCarrito(miCarrito);

    if (leeLogin().nombre) {
        nombreUser.textContent = leeLogin().nombre;
        cerrarSesion.classList.add('cerrar-sesion');
        cambiaColorIconoLogin('user-login-on','user-login-off');
    }
    else {
        nombreUser.textContent = "Ingresar";
        cerrarSesion.classList.remove('cerrar-sesion');
        cambiaColorIconoLogin('user-login-off','user-login-on');
    };
};

const seteaCarritoLS = (miCarrito) => {
    localStorage.setItem("micarrito", JSON.stringify(miCarrito));
    actualizaTotalesCarrito(miCarrito);
};

const leeLogin = () => {
    return JSON.parse(localStorage.getItem('Auth')) || { isLogin: false, nombre: "", email: "" };
};

const actualizaTotalesCarrito = (miCarrito) => {
    const totalProductos = document.querySelector(".productos");
    const totalItems = document.querySelector(".items");
    const totalImporte = document.querySelector(".importe");
    
    const totalItemsSubTotalCarrito = document.querySelector(".modal-subtotal-carrito-2");
    const totalImporteSubTotalCarrito = document.querySelector(".modal-subtotal-carrito-3");
    const totalProductosSubTotalCarrito = document.querySelector(".modal-subtotal-carrito-1");

    totalProductos.textContent = miCarrito.length;
    totalProductosSubTotalCarrito.textContent = `Total Productos: ( ${miCarrito.length} )`;
    
    const totalItemsCarrito = miCarrito.reduce((totalAcum, valorActual) => {
        return totalAcum + valorActual.getCantidad();
    }, 0);
    totalItems.textContent = totalItemsCarrito;
    actualizaContadorCarrito(totalItemsCarrito);
    totalItemsSubTotalCarrito.textContent = totalItemsCarrito;
    
    const totalImporteCarrito = miCarrito.reduce((totalAcum, valorActual) => {
        return totalAcum + (valorActual.getCantidad() * valorActual.getPrecio());
    }, 0);
    totalFinalCarrito = totalImporteCarrito;
    totalImporte.textContent = '$ ' + totalImporteCarrito.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    totalImporteSubTotalCarrito.textContent = '$ ' + totalImporteCarrito.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); //total importe del subtotal del carrito
};

const actualizaContadorCarrito = (items) => {
    const carritoContadorItems = document.querySelector(".carrito-contador");
    const carritoContadorNavItems = document.querySelector(".carrito-contador-nav");
    carritoContadorItems.textContent= items;
    carritoContadorNavItems.textContent=items;
    (items > 0) ? (carritoContadorItems.style.display="block") : (carritoContadorItems.style.display="none");
    (items > 0) ? (carritoContadorNavItems.style.display="block") : (carritoContadorNavItems.style.display="none");
};

const modalShowToggleCarrito = () => {
    modal.classList.toggle('modal--show');
};
const modalShowToggleFinCompra = () => {
    modalFinCompra.classList.toggle('modal-fincompra--show');
};
const modalShowToggleLogin = () => {
    modalLogin.classList.toggle('modal-login--show');
};
const modalShowToggleCerrarSesion = () => {
    cerrarSesion.classList.toggle('cerrar-sesion');
};
const modalShowToggleNuevoUsuario = () => {
    modalNuevoUsuario.classList.toggle('modal-nuevoUsuario--show');
};

export const cargarProductos = (productos,textoProductosEncontrados="Productos Encontrados: ") => {
    borrarArticulos();
    if (productos.length === 0) {
        textoAlternativo.innerHTML = `<p class="texto-alternativo">No hay productos por mostrar.</p>`
    }
    else {
        (textoABuscar.value) && (textoAlternativo.innerHTML = `<p class="texto-alternativo">Resultado de la búsqueda <b>Por ${(tipoFiltro.value === '1' ? "Descripción" : "Categoría")}</b></p>
                                                                   <span class="color-alternativo">'${textoABuscar.value}'</span>`);
        (productos.length > 0) && (cantidadProdEncontrados.innerHTML = `<p class="total-productos">${textoProductosEncontrados}<b>${productos.length}</b></p>`);
        productos.forEach((el) => {
            let precioFormateado = el.precio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            const articuloDiv = document.createElement('div');
            articuloDiv.classList.add('articulo');

            const articuloDivIMG = document.createElement('div');
            articuloDivIMG.classList.add('articulo-img');

            const articuloIMG = document.createElement('img');
            articuloIMG.src=el.url;
            articuloIMG.alt=el.nombre;
            
            const articuloNombre = document.createElement('p');
            articuloNombre.classList.add('articulo-nombre');
            articuloNombre.textContent = el.nombre;
            
            const articuloLineaPrecioDiv = document.createElement('div');
            articuloLineaPrecioDiv.classList.add('articulo-linea-precio');
            const articuloPrecio = document.createElement('p');
            articuloPrecio.classList.add('articulo-precio');
            articuloPrecio.textContent = `$ ${precioFormateado}`;
            
            articuloDivIMG.appendChild(articuloIMG);
            articuloDiv.appendChild(articuloDivIMG);
            articuloDiv.appendChild(articuloNombre);
            articuloLineaPrecioDiv.appendChild(articuloPrecio);
            articuloDiv.appendChild(articuloLineaPrecioDiv);

            if(el.oferta[0] > 0) {
                let precioLista = (el.precio / ((100 - el.oferta[0]) / 100));
                let precioListaFormateado = precioLista.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); //da formato al precio anterior

                const articuloPrecioLista = document.createElement('p');
                articuloPrecioLista.classList.add('articulo-preciolista');
                articuloPrecioLista.textContent = `$${precioListaFormateado}`;
                articuloPrecio.parentNode.insertBefore(articuloPrecioLista, articuloPrecio);

                const articuloOferta = document.createElement('p');
                articuloOferta.classList.add('articulo-oferta');
                articuloOferta.textContent = `${el.oferta[0]}% off`
                articuloOferta.style.backgroundColor = el.oferta[1];
                articuloLineaPrecioDiv.appendChild(articuloOferta);
            };

            const botonComprar = document.createElement('button');
            botonComprar.classList.add("articulo-button");
            botonComprar.textContent = "Comprar";
            botonComprar.addEventListener("click", () => {
                agregaArticulo(el.codigo, el.nombre, el.precio);
            });
            articuloDiv.appendChild(botonComprar);
            seccionProductos.appendChild(articuloDiv);
        });
    }
};

const borrarArticulos = () => {
    textoAlternativo.innerHTML = `<p class="texto-alternativo"></p>`
    cantidadProdEncontrados.innerHTML = `<p class="total-productos"></p>`
    seccionProductos.innerHTML = '';
};

const agregaArticulo = (codigo, nombre, precio) => {
    let cantidad = verificaCantidadEnCarrito(codigo);
    actualizaMiCarrito(codigo, nombre, precio, cantidad);
};


const restaArticulo = (codigo) => {
    let cantidad = verificaCantidadEnCarrito(codigo);
    const indice = miCarrito.findIndex((producto) => producto.getCodigo() === codigo);
    (indice >= 0) && miCarrito[indice].setCantidad(cantidad - 1)
    seteaCarritoLS(miCarrito);
    alertAgregado('success', 'Se quitó una unidad.', '#dd710c');    
};

const verificaCantidadEnCarrito = (codigo = '') => {
    if (miCarrito.length === 0) return 0;
    const buscar = miCarrito.find((producto) => producto.getCodigo() === codigo);
    if (buscar) return buscar.getCantidad();
    return 0;
};

const actualizaMiCarrito = (codigo, nombre, precio, cantidad) => {
    const indice = miCarrito.findIndex((producto) => producto.getCodigo() === codigo);
    (indice >= 0)
        ? miCarrito[indice].setCantidad(cantidad + 1)
        : miCarrito.push(new CarritoCompra(codigo, nombre, 1, precio));
    seteaCarritoLS(miCarrito);
    alertAgregado('success', 'Producto agregado', '#dd710c');
};

const alertAgregado = (icono, titulo, colorFondo) => {
    Toast.fire({
        icon: icono,
        title: titulo,
        background: colorFondo,
        width:300
    });
};

const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    width: 300,
    color: 'whitesmoke',
    timer: 800,
    timerProgressBar: true,
});

const filtrarOfertas = () => {
    let filtroOfertas = [];
    filtroOfertas = totalProductos.filter((el) => (el.oferta[0] > 0));
    return filtroOfertas;
};

const muestraCarritoCompras = () => {
    if (miCarrito.length === 0) {
        alertaCarritoVacio(0, false);
    }
    else {
        modalShowToggleCarrito();
        agregaHtmlCarrito(miCarrito);
    }
};

const alertaCarritoVacio = (miliSeg, ocultaModal) => {
    setTimeout(() => {
        (ocultaModal) && modalShowToggleCarrito();
        Swal.fire({
            confirmButtonColor: 'rgb(11, 168, 11)',
            title: 'Carrito de Compras vacío',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }, miliSeg);
};

const limpiaHtmlCarrito = () => {
    const productosModalCarrito = document.querySelectorAll(".modal-productos");
    productosModalCarrito.forEach((div) => {
        div.remove();
    })
};

const agregaHtmlCarrito = (miCarrito) => {
    limpiaHtmlCarrito();
    const miCarritoOrdenado = miCarrito.slice().sort(function (a, b) {
        return miCarrito.indexOf(b) - miCarrito.indexOf(a);
    });
    miCarritoOrdenado.forEach((el) => {
        const producto = document.createElement('div');
        let precioUnitFormateado = el.getPrecio().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); //da formato al precio unitario
        let precioTotal = (el.getPrecio() * el.getCantidad());
        let precioTotalFormateado = precioTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); //da formato al precio total
        const urlProducto = buscaURLProducto(el.codigo);
        producto.classList.add('modal-productos');
        producto.id = el.codigo;

        producto.innerHTML = ` 
                            <img class="modal-productos-img" src="${urlProducto.url}" alt="${el.getNombre()}"></img>
                            <span class="modal-productos-col1">${el.getNombre()}</span>
                            <div class="modal-productos-col2-div">
                                <span class="modal-productos-col2-resta">-</span>
                                <span class="modal-productos-col2">${el.getCantidad()}</span>
                                <span class="modal-productos-col2-suma">+</span>
                            </div>
                            <span class="modal-productos-col3">${precioUnitFormateado}</span>
                            <span class="modal-productos-col3Total">${precioTotalFormateado}</span>
                            <a class="modal-productos-eliminar" href="#">X</a>
                            </div>`

        modalContainer.insertBefore(producto, modalContainerTitulo.nextSibling);
        const eliminarProducto = document.querySelector(".modal-productos-eliminar");
        
        eliminarProducto.addEventListener("click", () => {
            confirmaEliminarProducto(miCarrito, el.codigo, el.nombre); user - login
        });

        sumaYrestaCantidad(el);
    });
};

const buscaURLProducto = ((codigoProducto) => {
    return totalProductos.find((item => item.codigo === codigoProducto));
});

const confirmaEliminarProducto = (miCarrito, codigoProducto, nombreProducto) => {
    const urlProducto = buscaURLProducto(codigoProducto);
    
    Swal.fire({
        title: `${nombreProducto} será eliminado! Confirma?`,
        imageUrl: urlProducto.url,
        imageWidth: 80,
        imageHeight: 120,
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonColor: 'rgb(11, 168, 11)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, confirmo!'
    }).then((result) => {
        if (result.isConfirmed) {
            borraProducto(miCarrito, codigoProducto);
            let textoTitle = "El producto ha sido eliminado!";
            if (miCarrito.length === 0) textoTitle = "El carrito ha sido vaciado!";
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: textoTitle,
                showConfirmButton: false,
                timer: 1100
            })
        }
    })
};

const borraProducto = (miCarrito, codigoProducto) => {
    let index = miCarrito.findIndex((objeto) => {
        return objeto.codigo === codigoProducto;
    });

    if (index !== -1) {
        miCarrito.splice(index, 1);
        seteaCarritoLS(miCarrito);
        const itemABorrar = document.getElementById(codigoProducto);
        itemABorrar.remove();
        if (miCarrito.length === 0) {
            setTimeout(() => {
                modalShowToggleCarrito();
            }, 1100);
        }
    }
};

const sumaYrestaCantidad = ((el) => {
    const cantidadProducto = document.querySelector(".modal-productos-col2");
    const precioTotalProducto = document.querySelector(".modal-productos-col3Total");

    const restaCantidad = document.querySelector(".modal-productos-col2-resta");

    restaCantidad.addEventListener("click", () => {
        if(el.getCantidad() != 1){
            restaArticulo(el.getCodigo());
            cantidadProducto.textContent= el.getCantidad();
            let precioTotalFormateado = (el.getPrecio() * el.getCantidad()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); //da formato al precio total
            precioTotalProducto.textContent = precioTotalFormateado;
        }
    });

    const sumaCantidad = document.querySelector(".modal-productos-col2-suma");
    
    sumaCantidad.addEventListener("click", () => { 
        agregaArticulo(el.getCodigo(),el.getNombre(),el.getPrecio());   
        cantidadProducto.textContent= el.getCantidad();   
        let precioTotalFormateado = (el.getPrecio() * el.getCantidad()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); //da formato al precio total
        precioTotalProducto.textContent = precioTotalFormateado;
    });
});

const setLogin = (opcion, nombreUsuario, emailUsuario) => {
    localStorage.setItem("Auth", JSON.stringify({ isLogin: opcion, nombre: nombreUsuario, email: emailUsuario }));
};

const cambiaColorIconoLogin = (arg1,arg2) => {
    usuarioLogin.classList.add(arg1);
    usuarioLogin.classList.remove(arg2);
};

const filtrarProductos = () => {
    let filtroProductos = [];
    (tipoFiltro.value === "1")
        ? filtroProductos = totalProductos.filter((el) => (el.nombre.toLowerCase()).includes(textoABuscar.value.toLowerCase())) //busca por nombre del producto value = 1
        : filtroProductos = totalProductos.filter((el) => (el.categoria.toLowerCase()).includes(textoABuscar.value.toLowerCase())); //busca por categoría del producto value = 2
    return filtroProductos;
};

const limpiaFiltro = () => {
    tipoFiltro.value="1";
    textoABuscar.placeholder = "Producto...";
    textoABuscar.value="";
    textoAlternativo.innerHTML="";
};

const validaIngreso = () => {
    if (leeLogin().isLogin === false) {
        usuarioClave.value = '',usuarioEmail.value = '';
        errorLogin.classList.remove('errorLog--show');
        modalShowToggleLogin();
        return false;
    };
    return true;
};

const agregaHtmlFPago = () => {
    completaEMail();
    const totalAPagar = document.querySelector(".importe-totalapagar");
    totalAPagar.textContent = `$ ${totalFinalCarrito.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.selected = true;
    opt.textContent = "Seleccione una opción...";
    selectFPago.appendChild(opt);
    bdFPago.forEach((op) => {
        let cantPago = "";
        let impCuota = (totalFinalCarrito + (totalFinalCarrito * op.tasa / 100)) / op.cuotas;
        impCuota = impCuota.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        (op.cuotas > 1) ? cantPago = "pagos" : cantPago = "pago";
        let textoFPago = ` ( ${op.cuotas} ${cantPago} de ${impCuota} )`;
        const opt = document.createElement('option');
        opt.value = op.codigo;
        opt.textContent = op.nombre + textoFPago;
        selectFPago.appendChild(opt)
    });
};

const vaciaCarritoCompras = () => {
    Swal.fire({
        title: `El carrito será vaciado! Confirma?`,
        imageWidth: 80,
        imageHeight: 120,
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonColor: 'rgb(11, 168, 11)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, confirmo!'
    }).then((result) => {
        if (result.isConfirmed) {
            miCarrito.forEach((el) => {
                const itemABorrar = document.getElementById(el.codigo);
                itemABorrar.remove();
            });
            miCarrito.splice(0);
            seteaCarritoLS(miCarrito);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El carrito ha sido vaciado!',
                showConfirmButton: false,
                timer: 1100
            })
            setTimeout(() => {
                modalShowToggleCarrito();
            }, 1100);
        }
    })
};

const limpiaHtmlFPago = () => {
    while (selectFPago.firstChild) {
        selectFPago.removeChild(selectFPago.firstChild);
    }
};

const completaEMail = () => {
    const email = document.querySelector("#email");
    email.value = leeLogin().email;
};

const validaFPago = (opcionSel, value) => {
    if (opcionSel === 0) return alertaDatosIngresados('Debe seleccionar una forma de pago.') && false;
    const buscar = bdFPago.find((el) => el.codigo === value);
    if (buscar) {
        const desFPago = document.querySelector("#descripcion-fpago");
        let cantPago = "";
        let totalPago = (totalFinalCarrito + (totalFinalCarrito * buscar.tasa / 100));
        let impCuota = totalPago / buscar.cuotas;
        impCuota = impCuota.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        totalPago = totalPago.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        (buscar.cuotas > 1) ? cantPago = "pagos" : cantPago = "pago";
        if (buscar.cuotas > 1) {
            desFPago.classList.add('descripcion-fpago-siv');
            desFPago.classList.remove('descripcion-fpago-nov');
            desFPago.textContent = `En ${buscar.cuotas} ${cantPago} de $${impCuota}. Total: $${totalPago}. Recargo ${buscar.tasa}%`;

        }
        else if (buscar.detalles !== "") {
            desFPago.classList.add('descripcion-fpago-siv');
            desFPago.classList.remove('descripcion-fpago-nov');
            desFPago.textContent = `Deberá transferir al CBU Nº ${buscar.detalles}`;
        }
        else {
            desFPago.classList.add('descripcion-fpago-nov');
            desFPago.classList.remove('descripcion-fpago-siv');
            desFPago.textContent = "";
        }
        cantCuota = buscar.cuotas;
        importeCuota = impCuota.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    return true;
};

const validacionDatosPersonales = () => {
    const nombre = document.querySelector("#nombre");
    const apellido = document.querySelector("#apellido");
    const email = document.querySelector("#email");
    const domicilio = document.querySelector("#domicilio");
    const ciudad = document.querySelector("#ciudad");
    
    if (!nombre.value) return alertaDatosIngresados('Debe ingresar su nombre.') && false;
    if (!regexApellidoNombre.test(nombre.value)) return alertaDatosIngresados('El nombre ingresado no es válido.') && false;

    if (!apellido.value) return alertaDatosIngresados('Debe ingresar su apellido.') && false;
    if (!regexApellidoNombre.test(apellido.value)) return alertaDatosIngresados('El apellido ingresado no es válido.') && false;

    if (!email.value) return alertaDatosIngresados('Debe ingresar su e-mail.') && false;
    if (!regexEMail.test(email.value)) return alertaDatosIngresados('El correo ingresado no es válido') && false;

    if (!domicilio.value) return alertaDatosIngresados('Debe ingresar su domicilio.') && false;

    if (!ciudad.value) return alertaDatosIngresados('Debe ingresar su ciudad.') && false;

    return true;
};

const alertaDatosIngresados = (texto) => {
    Swal.fire({
        text: texto,
        confirmButtonColor: 'red'
    });
};

const confirmaCompra = () => {
    let descri = "pago";
    (cantCuota > 1) ? descri = "pagos" : descri = "pago";
    Swal.fire({
        title: `Se va a efectuar la compra en ${cantCuota} ${descri} de ${importeCuota}.`,
        text: "Confirma?",
        html:
            '<span style="font-size: 1.5rem;"><b>Confirma?</b></span>',
        imageUrl: './img/compra.jpeg',
        imageWidth: 300,
        imageHeight: 250,
        imageAlt: 'Compra A Confirmar',
        showCancelButton: true,
        confirmButtonColor: 'rgb(168, 114, 13)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Confirmo la compra!',
        cancelButtonText: 'No quiero realizar la compra!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'El Nº de Orden es ' +  compraExitosa(),
                imageUrl: './img/graciascompra.webp',
                imageWidth: 290,
                imageHeight: 270,
                imageAlt: 'Gracias por su Compra',
                confirmButtonColor: 'rgb(168, 114, 13)'
              })
            setTimeout(() => {
                modalShowToggleFinCompra();
            }, 1100);
        }
    })
};

const compraExitosa = () => {
    miCarrito.splice(0);
    seteaCarritoLS(miCarrito);
    let numOrden = Math.floor(Math.random() * 90000) + 10000;
    const nombre = document.querySelector("#nombre");
    let mensaje = `Se ha generado la orden de compra número ${numOrden}. ${nombre.value}, gracias por confiar en nosotros.`;
    saludosDeVoz(mensaje);
    return numOrden;
};

const saludosDeVoz = (mensaje) => speechSynthesis.speak(new SpeechSynthesisUtterance(mensaje));
const validaUser = async () => {
    errorLogin.classList.add('errorLog--show');
    if(!usuarioEmail.value) {
        errorLogin.textContent="Debe ingresar un E-Mail !!";
        return
    }
    (usuarioEmail.value) && (errorLogin.textContent="Verificando E-Mail...");
    await fetch('https://fakestoreapi.com/users')
                .then(res=>res.json())
                .then((json) => {
                    const bdUsuariosExt = json.map(({ email, password, name: {firstname} }) => ({ email, clave: password, nombre: firstname}));
                    const bdUsuariosTotal = [...bdUsuariosInt, ...bdUsuariosExt];
                    const userExist = bdUsuariosTotal.find(el => ((el.email).toUpperCase() === (usuarioEmail.value).toUpperCase() && el.clave === usuarioClave.value));
                    if(userExist) {
                        errorLogin.classList.remove('errorLog--show');
                        bienvenidaUser(userExist.nombre, userExist.email, 0);
                    }
                    else {
                        errorLogin.classList.add('errorLog--show');
                        errorLogin.textContent="La combinación de E-Mail y clave no existen";
                    }
                }) 
                .catch(err=>errorLogin.classList.add('errorLog--show'))
            };

const bienvenidaUser = (nombreUsuario, emailUsuario, opc) => {
    let texto =(opc===0) ? `Hola ${nombreUsuario}, ingresaste a tu cuenta!!` : `Hola ${nombreUsuario}, tu cuenta ha sido creada. Accediendo...`;
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: texto,
        showConfirmButton: false,
        timer: 1100
    })
    setTimeout(() => {
        (modal.classList.contains('modal--show')) && modal.classList.remove('modal--show');
        setLogin(true, nombreUsuario, emailUsuario);
        modalShowToggleLogin();
        (opc===1) && modalShowToggleNuevoUsuario();
        (opc===1) && limpiaDatosNuevoUsuario();
        muestraNombreUsuario(nombreUsuario);
        if(blnModalFinalizarCompra) {
            limpiaHtmlFPago();
            modalShowToggleFinCompra();
            agregaHtmlFPago();
            blnModalFinalizarCompra=false;
        };
    }, 1100);
};

const limpiaDatosNuevoUsuario = () => {
    nuevoUsuarioEmail.value = '';
    nuevoUsuarioNombre.value='';
    nuevoUsuarioClave.value = '';
    nuevoUsuarioReIngreseClave.value='';
};

const muestraNombreUsuario = (nombreUsuario) => {
    nombreUser.textContent = nombreUsuario;
    modalShowToggleCerrarSesion();
    cambiaColorIconoLogin('user-login-on','user-login-off');
    saludosDeVoz(`Hola ${nombreUsuario}`);
};

const verificaExistenciaUsuario = async () => {
    errorNuevoUsuario.classList.add('errorLog-nuevoUsuario--show');
    if(!nuevoUsuarioEmail.value) {
        errorNuevoUsuario.textContent="Debe ingresar un E-Mail !!";
        return;
    }
    if (!regexEMail.test(nuevoUsuarioEmail.value)) {
        errorNuevoUsuario.textContent="El correo ingresado no es válido";
        return;
    }
    if(!nuevoUsuarioNombre.value) {
        errorNuevoUsuario.textContent="Debe ingresar un nombre !!";
        return;
    }
    if (!regexApellidoNombre.test(nuevoUsuarioNombre.value)) {
        errorNuevoUsuario.textContent="El nombre ingresado no es válido !!";
        return;
    }
    if(!nuevoUsuarioClave.value) {
        errorNuevoUsuario.textContent="Debe ingresar una clave !!";
        return;
    }
    if(nuevoUsuarioClave.value !== nuevoUsuarioReIngreseClave.value) {
        errorNuevoUsuario.textContent="Las claves ingresadas no coinciden !!";
        return;
    }
    (nuevoUsuarioEmail.value) && (errorNuevoUsuario.textContent="Verificando E-Mail...");
    await fetch('https://fakestoreapi.com/users')
    .then(res=>res.json())
    .then((json) => {
        const bdUsuariosExt = json.map(({ email, password, name: {firstname} }) => ({ email, clave: password, nombre: firstname}));
        const bdUsuariosTotal = [...bdUsuariosInt, ...bdUsuariosExt];
        const userExist = bdUsuariosTotal.find(el => ((el.email).toUpperCase() === (nuevoUsuarioEmail.value).toUpperCase()));
        if(userExist) {
            errorNuevoUsuario.classList.add('errorLog-nuevoUsuario--show');
            errorNuevoUsuario.textContent=`El E-Mail ${nuevoUsuarioEmail.value} ya se encuentra registrado.`;
            limpiaDatosNuevoUsuario();
            return;
        }
        else {
            let nuevoUsuario = {email: nuevoUsuarioEmail.value, nombre: nuevoUsuarioNombre.value, clave:nuevoUsuarioClave.value };
            bdUsuariosInt.push(nuevoUsuario);
            bienvenidaUser(nuevoUsuarioNombre.value, nuevoUsuarioEmail.value ,1);
            errorNuevoUsuario.classList.remove('errorLog-nuevoUsuario--show');
        }
    }) 
    .catch(err=>errorNuevoUsuario.classList.add('errorLog-nuevoUsuario--show'))
};

export const cargarEventos = () => {
    linkProductos.addEventListener("click", () => {
        cargarProductos(totalProductos, "Productos encontrados : ");
        limpiaFiltro();
    });

    linkOfertas.addEventListener("click", () => {
        const productosOferta = filtrarOfertas();
        cargarProductos(productosOferta,"Productos en Oferta : ");
        limpiaFiltro();
    });

    carrito.addEventListener("click", (e) => {
        e.preventDefault();
        muestraCarritoCompras();
    });

    totalesCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        muestraCarritoCompras();
    });

    usuarioLogin.addEventListener("click", (e) => {
        e.preventDefault();
        validaIngreso();
    });

    nombreUser.addEventListener("click", (e) => {
        e.preventDefault();
        validaIngreso();
    });

    cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        setLogin(false, "","");
        nombreUser.textContent = "Ingresar";
        modalShowToggleCerrarSesion();
        cambiaColorIconoLogin('user-login-off','user-login-on');
    });

    buscarProducto.addEventListener("click", () => {
        const filtroProductos = filtrarProductos();
        cargarProductos(filtroProductos,"Productos encontrados : ");
    });

    textoABuscar.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            const filtroProductos = filtrarProductos();
            cargarProductos(filtroProductos,"Productos encontrados : ");
        };
    });

    textoABuscar.addEventListener("input", (e) => {
        const { value } = e.target;
        !value && cargarProductos(totalProductos,"Productos encontrados : ");
    });

    tipoFiltro.addEventListener("change", (e) => {
        const { value } = e.target;
        if (value === "1") {
            textoABuscar.value = "";
            textoABuscar.placeholder = "Producto...";
        }
        else {
            textoABuscar.value = "";
            const categoriasUnicas = totalProductos.reduce((categorias, producto) => {
                categorias.add(producto.categoria);
                return categorias;
            }, new Set());
            const descripcionCategorias = [...categoriasUnicas].join(', ');
            textoABuscar.placeholder = descripcionCategorias + " ...";
        }
    });

    carritoFijo.addEventListener("click", (e) => {
        e.preventDefault();
        muestraCarritoCompras();
    });

    finalizarCompra.addEventListener("click", (e) => {
        e.preventDefault();
        blnModalFinalizarCompra = true;
        if (validaIngreso()) {
            modalShowToggleCarrito();
            setTimeout(() => {
                limpiaHtmlFPago();
                modalShowToggleFinCompra();
                agregaHtmlFPago();
            }, 200);
        };

    });

    vaciarCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        vaciaCarritoCompras();
    });

    cerrarModal.addEventListener("click", (e) => {
        e.preventDefault();
        modalShowToggleCarrito();
    });

    cerrarFinCompra.addEventListener("click", (e) => {
        e.preventDefault();
        modalShowToggleFinCompra();
    });

    selectFPago.addEventListener("change", (e) => {
        e.preventDefault();
        validaFPago(selectFPago.selectedIndex, selectFPago.value);
    });

    finalizarPago.addEventListener("click", (e) => {
        e.preventDefault();
        if (validacionDatosPersonales() && validaFPago(selectFPago.selectedIndex)) {
            confirmaCompra();
        }
    })

    volverAlCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        modalShowToggleFinCompra();
        modalShowToggleCarrito();
    });

    usuarioEmail.addEventListener("click", () => {
        errorLogin.classList.remove('errorLog--show');
    });

    usuarioEmail.addEventListener("input", (e) => {
        const { value } = e.target;
        !value && errorLogin.classList.remove('errorLog--show');
    });

    usuarioClave.addEventListener("input", (e) => {
        const { value } = e.target;
        !value && errorLogin.classList.remove('errorLog--show');
    });

    usuarioClave.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            validaUser();
        };
    });

    buttonLogin.addEventListener("click", () => {
        validaUser();
    });

    crearCuenta.addEventListener("click", (e) => {
        e.preventDefault();
        modalShowToggleNuevoUsuario();
    });
    
    nuevoUsuarioEmail.addEventListener("click", () => {
        errorNuevoUsuario.classList.remove('errorLog-nuevoUsuario--show');
    });

    nuevoUsuarioEmail.addEventListener("input", (e) => {
        const { value } = e.target;
        !value && errorNuevoUsuario.classList.remove('errorLog-nuevoUsuario--show');
    });

    nuevoUsuarioNombre.addEventListener("click", (e) => {
        const { value } = e.target;
        !value && errorNuevoUsuario.classList.remove('errorLog-nuevoUsuario--show');
    });

    nuevoUsuarioClave.addEventListener("input", (e) => {
        const { value } = e.target;
        !value && errorNuevoUsuario.classList.remove('errorLog-nuevoUsuario--show');
    });

    nuevoUsuarioReIngreseClave.addEventListener("input", (e) => {
        const { value } = e.target;
        !value && errorNuevoUsuario.classList.remove('errorLog-nuevoUsuario--show');
    });

    nuevoUsuarioReIngreseClave.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            verificaExistenciaUsuario();
        };
    });

    buttonNuevoUsuario.addEventListener("click", (e) => {
        e.preventDefault();
        verificaExistenciaUsuario();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modal.classList.remove('modal--show');
            modalFinCompra.classList.remove('modal-fincompra--show');
            modalLogin.classList.remove('modal-login--show');
            modalNuevoUsuario.classList.remove('modal-nuevoUsuario--show');
        }
    });
};