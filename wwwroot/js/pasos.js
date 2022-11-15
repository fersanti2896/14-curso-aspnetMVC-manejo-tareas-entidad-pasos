
function manejarAgregarPaso() {
    const indice = editarTareaViewModel.pasos().findIndex(p => p.esNuevo());

    if (indice !== -1) {
        return;
    }

    editarTareaViewModel.pasos.push(new pasoViewModel({ modoEdicion: true, realizado: false }));
    $("[name=txtPasoDescripcion]:visible").focus();
}