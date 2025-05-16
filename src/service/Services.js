import supabase from '../db/supabaseClient.js';

export const showAllUser = async () => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, name, role, email, auth_id")
        .not("auth_id", "is", null);

    if (error) {
        throw new Error(error.message);
    }

    return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: true
    }));
};

export const userLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw new Error(error.message);
    }

    return data.user;
};

export const registerUser = async (name, email, password, role) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        throw new Error(error.message);
    }
    const user = data.user;

    const { error: profileError } = await supabase.from("profiles").insert([
        { auth_id: user.id, name, email, role }
    ]);

    if (profileError) {
        throw new Error(profileError.message);
    }

};

export const editUser = async (userId, updates) => {
    const { name, role, email } = updates;

    const { data: userProfile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("auth_id")
        .eq("id", userId)
        .single();

    if (profileFetchError) {
        throw new Error(profileFetchError.message);
    }

    const authId = userProfile?.auth_id;

    const { error: profileError } = await supabase
        .from("profiles")
        .update({ name, role, email })
        .eq("id", userId);

    if (profileError) {
        throw new Error(profileError.message);
    }

    if (email) {
        const { error: authError } = await supabase.auth.admin.updateUserById(authId, { email });

        if (authError) {
            throw new Error(authError.message);
        }
    }

    return { success: true };
};

export const deleteUser = async (userId) => {
    const { data: userProfile } = await supabase
        .from("profiles")
        .select("auth_id")
        .eq("id", userId)
        .single();

    const authId = userProfile.auth_id;

    const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (profileError) {
        throw new Error(`Error eliminando perfil: ${profileError.message}`);
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(authId);

    if (authError) {
        throw new Error(`Error eliminando usuario de autenticación: ${authError.message}`);
    }

    return { success: true };
};


export const ProductService = {
    // Obtener todos los productos
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Obtener producto por código
    async getByCode(cod) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('cod', cod)
            .single();

        if (error && !error.message.includes('No rows found')) throw error;
        return data;
    },

    // Crear nuevo producto
    async create(product) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) {
            console.error('Error al crear producto:', {
                details: error.details,
                message: error.message,
                code: error.code
            });
            throw new Error(error.message || 'Error al crear producto');
        }
        return data;
    },

    // Actualizar producto
    async update(cod, updates) {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('cod', cod)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Eliminar producto
    async delete(cod) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('cod', cod);

        if (error) throw error;
        return true;
    },

    // Subir imagen de producto
    async uploadImage(file, cod) {
        if (!cod) throw new Error("Código de producto requerido.");
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            throw new Error("Solo se permiten imágenes JPEG, PNG o WEBP");
        };
        if (file.size > 2 * 1024 * 1024) throw new Error("Límite de 2MB excedido");

        const fileExt = file.name.split('.').pop();
        const filePath = `product-images/${cod}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error("Error al subir:", { filePath, error });
            throw error;
        }

        return supabase.storage.from('product-images').getPublicUrl(filePath).data.publicUrl;;
    },
};

export const SalesService = {
    async getAll() {
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, data) {
        const { total, ...updateData } = data;

        const { data: updated, error } = await supabase
            .from('sales')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },

    async updateWithStock(id, data, quantityDiff) {
        const { data: updatedSale, error: saleError } = await supabase
            .from('sales')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (saleError) throw saleError;

        if (quantityDiff !== 0) {
            const { error: stockError } = await supabase.rpc('update_product_stock', {
                product_id: data.product_id,
                quantity_change: -quantityDiff
            });

            if (stockError) {
                console.error("Error updating stock:", stockError);
                throw new Error("No se pudo actualizar el stock del producto");
            }
        }

        return updatedSale;
    },

    async delete(id) {
        const { error } = await supabase
            .from('sales')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async createBatch(salesData) {
        try {
            // Obtener productos únicos
            const productCodes = [...new Set(salesData.map(s => s.product_cod))];
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*')
                .in('cod', productCodes);

            if (productsError) throw productsError;

            // Crear registros de venta
            const salesRecords = salesData.map(sale => {
                const product = products.find(p => p.cod === sale.product_cod);
                if (!product) throw new Error(`Producto ${sale.product_cod} no encontrado`);

                return {
                    product_id: product.id,
                    product_name: product.product,
                    price: sale.price,
                    quantity: sale.quantity,
                    payment_method: sale.payment_method,
                    created_at: sale.created_at
                };
            });

            // Insertar ventas y actualizar stock
            const [salesResult, stockResult] = await Promise.all([
                supabase.from('sales').insert(salesRecords),
                supabase.rpc('update_multiple_stocks', {
                    product_data: salesData.map(s => ({
                        product_cod: s.product_cod,
                        quantity: -s.quantity
                    }))
                })
            ]);

            if (salesResult.error) throw salesResult.error;
            if (stockResult.error) {
                console.error("Error al actualizar stock:", stockResult.error);
                throw stockResult.error;
            }

            return salesResult.data;
        } catch (error) {
            console.error('Error al guardar ventas:', error);
            throw error;
        }
    }
};

export const ProviderService = {
    // Obtener todos los proveedores
    async getAll() {
        const { data, error } = await supabase
            .from('providers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Obtener proveedor por código
    async getByCode(cod_provider) {
        const { data, error } = await supabase
            .from('providers')
            .select('*')
            .eq('cod_provider', cod_provider)
            .single();

        if (error && !error.message.includes('No rows found')) throw error;
        return data;
    },

    // Crear nuevo proveedor
    async create(provider) {
        const { data, error } = await supabase
            .from('providers')
            .insert([provider])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Actualizar proveedor
    async update(id, updates) {
        const { data, error } = await supabase
            .from('providers')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Eliminar proveedor
    async delete(id) {
        const { error } = await supabase
            .from('providers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const InputService = {
    // Obtener todos los insumos
    async getAll() {
        const { data, error } = await supabase
            .from('inputs')
            .select(`
                *,
                products:product_id (*),
                providers:provider_id (*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Obtener insumos por producto
    async getByProduct(productId) {
        const { data, error } = await supabase
            .from('inputs')
            .select('*')
            .eq('product_id', productId);

        if (error) throw error;
        return data;
    },

    // Obtener insumos por proveedor
    async getByProvider(providerId) {
        const { data, error } = await supabase
            .from('inputs')
            .select('*')
            .eq('provider_id', providerId);

        if (error) throw error;
        return data;
    },

    // Crear nuevo insumo
    async create(input) {
        const { data, error } = await supabase
            .from('inputs')
            .insert([input])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Actualizar insumo
    async update(id, updates) {
        // Validación de campos requeridos
        if (!id) throw new Error('ID de insumo es requerido');
        if (!updates) throw new Error('Datos de actualización son requeridos');

        // Preparar los datos de actualización
        const updateData = {
            ...updates,
            updated_at: new Date().toISOString()
        };

        // Eliminar campos que no deberían actualizarse
        delete updateData.id;
        delete updateData.created_at;

        const { data, error } = await supabase
            .from('inputs')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error al actualizar insumo ${id}:`, error);
            throw error;
        }
        return data;
    },

    // Método específico para asociar/desasociar productos
    async updateProductAssociation(inputId, productId) {
        if (!inputId) throw new Error('ID de insumo es requerido');

        // productId puede ser null para desasociar
        const { data, error } = await supabase
            .from('inputs')
            .update({
                product_id: productId,
                updated_at: new Date().toISOString()
            })
            .eq('id', inputId)
            .select()
            .single();

        if (error) {
            console.error(`Error al actualizar asociación para insumo ${inputId}:`, error);
            throw error;
        }
        return data;
    },

    // Eliminar insumo
    async delete(id) {
        const { error } = await supabase
            .from('inputs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Método para obtener insumos marcando los asociados al producto
    async getInputsByProviderWithAssociation(providerId, productId = null) {
        const { data, error } = await supabase
            .from('inputs')
            .select(`
            *,
            products:product_id (*),
            providers:provider_id (*)
        `)
            .eq('provider_id', providerId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (productId) {
            return data.map(input => ({
                ...input,
                isAssociated: input.product_id === productId
            }));
        }

        return data;
    },

    // Actualizar stock de insumo
    async updateStock(id, quantityChange) {
        const inputId = Number(id);
        const qtyChange = Number(quantityChange);

        // Obtener el stock actual primero
        const { data: current, error: fetchError } = await supabase
            .from('inputs')
            .select('stock')
            .eq('id', inputId)
            .single();

        if (fetchError) throw fetchError;

        // Calcular nuevo stock
        const newStock = (current.stock || 0) + qtyChange;

        // Actualizar directamente
        const { data, error } = await supabase
            .from('inputs')
            .update({
                stock: newStock,
                updated_at: new Date().toISOString()
            })
            .eq('id', inputId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

export const PurchaseService = {
    async getAll() {
        try {
            // Consulta principal con todas las relaciones necesarias
            const { data: purchases, error } = await supabase
                .from('purchases')
                .select(`
                    *,
                    provider:provider_id(id, provider_name),
                    product:product_id(id, product),
                    purchase_items: purchase_items(
                        *,
                        input:input_id(
                            id,
                            name,
                            price
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!purchases) return [];

            return purchases.map(purchase => ({
                ...purchases,
                id: purchase.id,
                provider_id: purchase.provider_id,
                provider_name: purchase.provider?.provider_name || 'Sin proveedor',
                product_id: purchase.product_id,
                product_name: purchase.product?.product || 'Sin producto',
                payment_method: purchase.payment_method,
                term: purchase.term,
                date: purchase.created_at,
                total: purchase.total,
                items: purchase.purchase_items?.map(item => ({
                    id: item.id,
                    input_id: item.input_id,
                    input_name: item.input?.name || 'Sin nombre',
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.subtotal,
                })) || []
            }));

        } catch (error) {
            console.error("Error fetching purchases:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('purchases')
                .select(`
                    *,
                    providers (*),
                    products (*),
                    purchase_items (
                        *,
                        inputs (*)
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching purchase:", error);
            throw error;
        }
    },

    async updateComplete(purchaseId, purchaseData, providerData, itemsData) {
        try {
            const operations = [];

            // Actualizar datos principales de la compra
            operations.push(
                supabase.from('purchases')
                    .update({
                        payment_method: purchaseData.payment_method,
                    })
                    .eq('id', purchaseId)
            )

            // Actualizar datos de proveedor si hay cambios
            if (providerData && providerData.id) {
                operations.push(
                    supabase.from('providers')
                        .update({
                            provider_name: providerData.provider_name
                        })
                        .eq('id', providerData.id)
                )
            }

            // Manejar los items
            if (itemsData && itemsData.length > 0) {
                const { data: existingItems, error: itemsError } = await supabase
                    .from('purchase_items')
                    .select('*')
                    .eq('purchase_id', purchaseId);

                if (itemsError) throw itemsError;

                // Separar items para actualizar
                const itemsToUpdate = itemsData.filter(item => item.id);

                // Operaciones de actualización
                for (const item of itemsToUpdate) {
                    operations.push(
                        supabase.from('purchase_items')
                            .update({
                                input_id: item.input_id,
                                quantity: item.quantity,
                                price: item.price,
                                subtotal: item.quantity * item.price
                            })
                            .eq('id', item.id)
                    );
                }
            }

            // Ejecutar todas las operaciones
            const results = await Promise.all(operations);

            // Verificar errores
            for (const result of results) {
                if (result.error) throw result.error;
            }

            // Obtener y devolver los datos actualizados
            const { data: updatedPurchase, error: fetchError } = await supabase
                .from('purchases')
                .select(`
                    *,
                    provider:provider_id(id, provider_name),
                    purchase_items: purchase_items(
                        *,
                        input:input_id(
                            id,
                            name,
                            price
                        )
                    )
                `)
                .eq('id', purchaseId)
                .single()

            if (fetchError) throw fetchError;

            return updatedPurchase;
        } catch (error) {
            console.error("Error updating complete purchase:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            // Primero eliminamos los items asociados
            const { error: itemsError } = await supabase
                .from('purchase_items')
                .delete()
                .eq('purchase_id', id);

            if (itemsError) throw itemsError;

            // Luego eliminamos la compra
            const { error } = await supabase
                .from('purchases')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting purchase:", error);
            throw error;
        }
    },

    async createPurchase(purchaseData) {
        try {
            const { data: purchase, error: purchaseError } = await supabase
                .from('purchases')
                .insert([purchaseData])
                .select()
                .single();

            if (purchaseError) throw purchaseError;
            return purchase;
        } catch (error) {
            console.error("Error al crear la compra:", error);
            throw error;
        }
    },

    async createPurchaseItems(items) {
        try {
            const { error: itemsError } = await supabase
                .from('purchase_items')
                .insert(items);

            if (itemsError) throw itemsError;
            return true;
        } catch (error) {
            console.error("Error al crear items de compra:", error);
            throw error;
        }
    },

    async createCompletePurchase(purchaseData, items, allInputs) {
        try {
            // Crear la compra
            const purchase = await this.createPurchase(purchaseData);

            // Actualizar los items con el purchase_id correcto
            const itemsWithPurchaseId = items.map(item => ({
                ...item,
                purchase_id: purchase.id
            }));

            // Crear los items de la compra
            await this.createPurchaseItems(itemsWithPurchaseId);

            // 3. Asociar insumos al producto
            const updatePromises = itemsWithPurchaseId.map(async (item) => {
                const currentInput = allInputs.find(i => i.id === item.input_id);
                if (!currentInput || currentInput.product_id !== purchaseData.product_id) {
                    try {
                        await InputService.updateProductAssociation(
                            item.input_id,
                            purchaseData.product_id
                        );
                        console.log(`Insumo ${item.input_id} asociado correctamente al producto ${purchaseData.product_id}`);
                    } catch (error) {
                        console.error(`Error al asociar insumo ${item.input_id}:`, error);
                    }
                }
            });

            await Promise.all(updatePromises);

            return purchase;
        } catch (error) {
            console.error("Error en el proceso completo de compra:", error);
            throw error;
        }
    }
};