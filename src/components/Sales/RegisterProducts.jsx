import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SalesActions from './SalesActions';
import ProductsTable from './Tables/ProductsTable';
import ProductForm from './ProductForm';
import { ProductService } from '../../service/Services';

const RegisterProducts = () => {
    const [formData, setFormData] = useState({
        cod: '',
        created_at: new Date().toISOString().split('T')[0],
        product: '',
        description: '',
        price: 0,
        current_stock: 0,
        min_stock: 0,
        image: '',
        update_at: new Date().toISOString().split('T')[0],
    });
    const [products, setProducts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tempQuantity, setTempQuantity] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            showError("No se pudieron cargar los productos", error);
        } finally {
            setLoading(false);
        }
    };

    const calculatedCurrentStock = formData.current_stock + tempQuantity;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cod' && value.trim() === '') {
            setFormData({
                cod: '',
                created_at: new Date().toISOString().split('T')[0],
                product: '',
                description: '',
                price: 0,
                current_stock: 0,
                min_stock: 0,
                image: '',
                update_at: new Date().toISOString().split('T')[0],
            });
            return;
        }

        const numericFields = ['quantity', 'price', 'current_stock', 'min_stock'];
        const processedValue = numericFields.includes(name)
            ? Number(value) || 0
            : value;

        setFormData({ ...formData, [name]: processedValue });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!formData.cod.trim()) {
            Swal.fire("Error", "Primero ingrese un código de producto", "error");
            return;
        }
        setLoading(true);
        try {
            const publicUrl = await ProductService.uploadImage(file, formData.cod);
            await ProductService.update(formData.cod, { image: publicUrl });
            setFormData(prev => ({ ...prev, image: publicUrl }));
            await fetchProducts();
            Swal.fire("Éxito", "Imagen subida correctamente", "success");
        } catch (error) {
            console.error("Error al subir imagen:", error);
            showError("No se pudo subir la imagen", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = formData.cod.trim()
        ? products.filter(product => product.cod === formData.cod)
        : [];

    const handleEdit = () => {
        if (!selectedProduct) {
            Swal.fire("Error", "Seleccione un producto para editar", "error");
            return;
        }
        setEditMode(true);
        setTempQuantity(0);
        setFormData(selectedProduct);
    };

    const handleCancel = () => {
        setEditMode(false);
        setTempQuantity(1);
        setFormData({
            cod: '',
            created_at: new Date().toISOString().split('T')[0],
            product: '',
            description: '',
            price: 0,
            current_stock: 0,
            min_stock: 0,
            image: '',
            update_at: new Date().toISOString().split('T')[0],
        });
        setSelectedProduct(null);
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                current_stock: Number(formData.current_stock) + Number(tempQuantity),
                min_stock: Number(formData.min_stock),
                update_at: new Date().toISOString().split('T')[0]
            };
            if (editMode) {
                await ProductService.update(formData.cod, productData);
            } else {
                await ProductService.create(productData);
            }
            await fetchProducts();
            handleCancel();
            Swal.fire("Guardado", "Los cambios han sido guardados", "success");
        } catch (error) {
            console.error("Error detallado al guardar:", {
                formData,
                tempQuantity,
                error
            });
            showError("Error al guardar el producto", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) {
            Swal.fire("Error", "No hay producto seleccionado", "error");
            return;
        }
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        });
        if (isConfirmed) {
            setLoading(true);
            try {
                await ProductService.deleteImage(selectedProduct.image);
                await ProductService.delete(selectedProduct.cod);
                await fetchProducts();
                handleCancel();
                Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
            } catch (error) {
                showError("Error al eliminar el producto", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const validateForm = () => {
        if (!formData.cod || !formData.product || formData.price <= 0) {
            Swal.fire("Error", "Por favor ingresa los datos correctamente", "error");
            return false;
        }
        return true;
    };

    const showError = (message, error) => {
        Swal.fire("Error", message, "error");
        console.error(error);
    };

    return (
        <div>
            {loading && <div className="loading-overlay">Cargando...</div>}
            <ProductForm
                formData={formData}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                products={products}
                setFormData={setFormData}
            />

            <ProductsTable
                formData={formData}
                products={products}
                filteredProducts={filteredProducts}
                editMode={editMode}
                selectedProduct={selectedProduct}
                handleChange={handleChange}
                setSelectedProduct={setSelectedProduct}
                tempQuantity={tempQuantity}
                setTempQuantity={setTempQuantity}
                calculatedCurrentStock={calculatedCurrentStock}
            />

            <SalesActions
                editMode={editMode}
                handleEdit={handleEdit}
                handleCancel={handleCancel}
                handleSave={handleSave}
                handleDelete={handleDelete}
                selectedSaleId={selectedProduct?.cod}
                selectedProduct={selectedProduct}
                showNewButton={formData.cod !== ''}
            />
        </div>
    );
};

export default RegisterProducts;