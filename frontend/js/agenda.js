const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const direccion = document.getElementById("direccion");
const indice = document.getElementById("indice");
const form = document.getElementById("form");
const btnGuardar = document.getElementById("btn-guardar");
const listaAgenda = document.getElementById("lista-agenda");
const url = "http://localhost:5000/usuarios";

let array_agenda = [];

async function listarAgenda() {
  try {
    const respuesta = await fetch(url);
    const agendaDelServer = await respuesta.json();
    if (Array.isArray(agendaDelServer)) {
      array_agenda = agendaDelServer;
    }
    if (array_agenda.length > 0) {
      const htmlAgenda = array_agenda.map((agenda, index) => `<tr>
      <th scope="row">${index}</th>
      <td>${agenda.nombre}</td>
      <td>${agenda.email}</td>
      <td>${agenda.direccion}</td>
      <td>
        <button type="button" class="btn btn-warning editar">Editar</button>
        <button type="button" class="btn btn-danger eliminar">Borrar</button>
      </td>
    </tr>`).join("");
      listaAgenda.innerHTML = htmlAgenda;
      Array.from(document.getElementsByClassName("editar")).forEach(
        (botonEditar, index) => (botonEditar.onclick = editar(index))
      );
      Array.from(document.getElementsByClassName("eliminar")).forEach(
        (botonEliminar, index) => (botonEliminar.onclick = eliminar(index))
      );
      return;
    }
    listaAgenda.innerHTML = `<tr>
        <td colspan="5" class="lista-vacia">No hay datos</td>
      </tr>`;
  } catch (error) {
    console.log({ error });
    $(".alert").show();
  }
}

async function enviarDatos(evento) {
  evento.preventDefault();
  try {
    const datos = {
      nombre: nombre.value,
      email: email.value,
      direccion: direccion.value,
    };
    let method = "POST";
    let urlEnvio = url;
    const accion = btnGuardar.innerHTML;
    if (accion === "Editar") {
      method = "PUT";
      array_agenda[indice.value] = datos;
      urlEnvio = `${url}/${indice.value}`;
    }
    const respuesta = await fetch(urlEnvio, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
      mode: "cors",
    });
    if (respuesta.ok) {
      listarAgenda();
      resetModal();
    }
  } catch (error) {
    console.log({ error });
    $(".alert").show();
  }
}

function editar(index) {
  return function cuandoCliqueo() {
    btnGuardar.innerHTML = "Editar";
    $("#exampleModalCenter").modal("toggle");
    const agenda = array_agenda[index];
    indice.value = index;
    nombre.value = agenda.nombre;
    email.value = agenda.email;
    direccion.value = agenda.direccion;
  };
}

function resetModal() {
  indice.value = "";
  nombre.value = "";
  email.value = "";
  direccion.value = "";
  btnGuardar.innerHTML = "Crear";
}

function eliminar(index) {
  const urlEnvio = `${url}/${index}`;
  return async function clickEnEliminar() {
    try {
      const respuesta = await fetch(urlEnvio, {
        method: "DELETE",
      });
      if (respuesta.ok) {
        listarAgenda();
        resetModal();
      }
    } catch (error) {
      console.log({ error });
      $(".alert").show();
    }
  };
}

listarAgenda();

form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;