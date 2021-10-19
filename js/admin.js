import {
  validarCampoRequerido,
  validarCodigo,
  validarUrl,
  validarGeneral,
} from "./validaciones.js";


//Declaro variables
let productos = []; //agrego un array vacio para los productos
//false -> tengo que agregar un producto nuevo.
//true -> tengo que modificar un producto existente.
let productoExistente = false;
let producto = document.querySelector("#producto");
let codigo = document.querySelector("#codigo");
let url = document.querySelector("#url");
let descripcion = document.querySelector("#descripcion");
let formulario = document.querySelector("#formProducto");
let btnAgregar = document.querySelector("#btnAgregar");

//agrego sus eventlisteners
codigo.addEventListener("blur", () => {
  validarCodigo(codigo);
});
producto.addEventListener("blur", () => {
  validarCampoRequerido(producto);
});
descripcion.addEventListener("blur", () => {
  validarCampoRequerido(descripcion);
});
url.addEventListener("blur", () => {
  validarUrl(url);
});
formulario.addEventListener("submit", guardarProducto);
btnAgregar.addEventListener("click", limpiarFormulario);

//verificar si hay datos en LocalStorage
cargaInicial();

//carga inicial de productos
function cargaInicial() {
    //si hay algo en localstorage lo llamo con getitem y si no hay nada llamamos a un array vacio
    productos = JSON.parse(localStorage.getItem("productosKey")) || [];
    //console.log(productos);
  
    //llamar a la función que crea filas
    productos.forEach((itemProducto) => {
      crearFila(itemProducto);
    });
  }

//creo una función para guardar el producto
function guardarProducto(event) {
  event.preventDefault();
  //primero validar datos del form
  if (validarGeneral()) {
    //tengo que modificar o tengo que agregar uno nuevo?
    if (productoExistente) {
      //modificar
      actualizarProducto();
    } else {
      //agregar
      //si esta todo ok crear un nuevo producto
      agregarProducto();
    }
  } else {
    console.log("aqui solo mostrar el cartel de error");
  }
}

//funcion para agregar producto
function agregarProducto() {
  let productoNuevo = new Producto(
    codigo.value,
    producto.value,
    descripcion.value,
    cantidad.value,
    url.value
  );
  //guardar el producto en un array
  productos.push(productoNuevo);
  console.log(productos);
  //guardar en localstorage
  localStorage.setItem("productosKey", JSON.stringify(productos));
  //limpiar el formulario
  limpiarFormulario();
  //dibujar fila en la tabla
  crearFila(productoNuevo);
  //mostrar un mensaje al usuario
  Swal.fire(
    "Producto agregado",
    "El producto fue agregado con éxito",
    "success"
  );
}

//funcion para crear filas
function crearFila(itemProducto) {
    //traigo el nodo padre que sería el tbody
    let tabla = document.querySelector("#tablaProductos");
    //creo la tabla
    tabla.innerHTML += `<tr>
    <th scope="row">${itemProducto.codigo}</th>
    <td>${itemProducto.producto}</td>
    <td>${itemProducto.descripcion}</td>
    <td>${itemProducto.url}</td>
    <td>
      <button class="btn btn-warning" onclick="prepararEdicionProducto(${itemProducto.codigo})">Editar</button>
      <button class="btn btn-danger" onclick="borrarProducto(${itemProducto.codigo})">Borrar</button>
    </td>
  </tr>`;
  }

//función para limpiar formulario
function limpiarFormulario() {
  //limpia los value de los elementos del form
  formulario.reset();
  //limpiar las clases de cada elemento del form
  codigo.className = "form-control rounded-pill border-dark border-1";
  //terminar de limpiar los inputs
  productoExistente = false;
}

//funcion invocada desde el html. (porque admin.js es tipo module)
window.prepararEdicionProducto = (codigo) => {
    //buscar el objeto en el array
    let productoEncontrado = productos.find((itemProducto) => {
      return itemProducto.codigo == codigo;
    });
    //mostrar los datos del objeto en el fomulario
    document.querySelector("#codigo").value = productoEncontrado.codigo;
    document.querySelector("#producto").value = productoEncontrado.producto;
    document.querySelector("#descripcion").value = productoEncontrado.descripcion;
    document.querySelector("#url").value = productoEncontrado.url;
    //cambiar el valor de la variable bandera para editar
    productoExistente = true;
  };
  