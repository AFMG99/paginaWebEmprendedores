import Swal from "sweetalert2";

export async function showAddInputSwal(currentProviderId, InputService, setInputs, showError) {
    const { value: formValues } = await Swal.fire({
        title: '<b>Agregar Nuevo Insumo</b>',
        width: '80%',
        html: `
            <div class="table-container">
                <table class="sales-table">
                    <thead style="background-color: #6a0dad; color: white;">
                        <tr>
                            <th>Nombre del Insumo</th>
                            <th>Precio</th>
                            <th>Cantidad Requerida</th>
                            <th>Stock Mínimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input 
                                    type="text" 
                                    id="swal-input1" 
                                    class="form-control" 
                                    placeholder="Nombre" 
                                    required
                                >
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    id="swal-input2" 
                                    class="form-control" 
                                    placeholder="Precio" 
                                    step="0.01"
                                >
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    id="swal-input3" 
                                    class="form-control" 
                                    placeholder="Cantidad requerida" 
                                    required
                                >
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    id="swal-input4" 
                                    class="form-control" 
                                    placeholder="Stock mínimo"
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        customClass: {
            title: 'text-titulo'
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#6a0dad',
        cancelButtonColor: '#d33',
        background: '#f5f0ff',
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value,
                document.getElementById('swal-input4').value
            ];
        }
    });

    if (formValues) {
        const [name, price, requiredQuantity, minStock] = formValues;
        if (!name || !requiredQuantity || isNaN(requiredQuantity)) {
            Swal.fire("Error", "Debe ingresar nombre y cantidad válida", "error");
            return;
        }

        try {
            const newInput = {
                name: name,
                provider_id: currentProviderId,
                price: parseFloat(price),
                current_stock: parseFloat(requiredQuantity),
                min_stock: parseFloat(minStock),
                unit: 'unidad',
                required_quantity: parseFloat(requiredQuantity)
            };

            const createdInput = await InputService.create(newInput);
            setInputs(prev => [...prev, createdInput]);
            Swal.fire("Éxito", "Insumo agregado correctamente", "success");
        } catch (error) {
            showError("Error al agregar insumo", error);
        }
    }
}