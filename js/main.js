import {
	cargaCarritoLS,
	cargarProductos,
	cargarEventos,
	totalProductos
} from "./functions.js";

cargaCarritoLS();
cargarEventos();
cargarProductos(totalProductos);