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

        const { data: updated, error} = await supabase
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