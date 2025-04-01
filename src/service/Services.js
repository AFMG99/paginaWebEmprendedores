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
        if (!cod) {
            throw new Error("Código de producto requerido para subir imagen");
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${cod}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw new Error("Solo se permiten imágenes JPEG, PNG o WEBP");
        }

        if (file.size > 2 * 1024 * 1024) {
            throw new Error("La imagen no puede superar los 2MB");
        }

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error("Error detallado al subir:", uploadError);
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    // Eliminar imagen de producto
    async deleteImage(imageUrl) {
        if (!imageUrl) return true;

        const imagePath = imageUrl.split('/').pop();
        const { error } = await supabase.storage
            .from('product-images')
            .remove([imagePath]);

        if (error) throw error;
        return true;
    }
};
