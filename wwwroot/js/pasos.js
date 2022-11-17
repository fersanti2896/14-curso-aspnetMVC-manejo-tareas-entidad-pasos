
function manejarAgregarPaso() {
    const indice = editarTareaViewModel.pasos().findIndex(p => p.esNuevo());

    if (indice !== -1) {
        return;
    }

    editarTareaViewModel.pasos.push(new pasoViewModel({ modoEdicion: true, realizado: false }));
    $("[name=txtPasoDescripcion]:visible").focus();
}

function obtenerCuerpoPeticion(paso) {
    return JSON.stringify({
        descripcion: paso.descripcion(),
        realizado: paso.realizado()
    });
}

async function insertarPaso(paso, data, idTarea) {
    const resp = await fetch(`${urlPasos}/${idTarea}`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (resp.ok) {
        const json = await resp.json();
        paso.id(json.id);
    } else {
        manejarErrorAPI(resp);
    }
}

async function manejarSalvarPaso(paso) {
    paso.modoEdicion(false);

    const esNuevo = paso.esNuevo();
    const idTarea = editarTareaViewModel.id;
    const data = obtenerCuerpoPeticion(paso);

    const descripcion = paso.descripcion();

    if (!descripcion) {
        paso.descripcion(paso.descripcionAnterior);

        if (esNuevo) {
            editarTareaViewModel.pasos.pop()
        }

        return;
    }

    if (esNuevo) {
        await insertarPaso(paso, data, idTarea);
    } else {
        actualizarPaso(data, paso.id());
    }
}

function manejarCancelarPaso(paso) {
    if (paso.esNuevo()) {
        editarTareaViewModel.pasos.pop();
    } else {
        paso.modoEdicion(false);
        paso.descripcion(paso.descripcionAnterior);
    }
}

/* Actualizando un paso */
function manejarDescripcionPaso(paso) {
    paso.modoEdicion(true);
    paso.descripcionAnterior = paso.descripcion();
    $("[name=txtPasoDescripcion]:visible").focus();
}

async function actualizarPaso(data, id) {
    const resp = await fetch(`${urlPasos}/${id}`, {
        method: 'PUT',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!resp.ok) {
        manejarErrorAPI(resp);
    }
}
