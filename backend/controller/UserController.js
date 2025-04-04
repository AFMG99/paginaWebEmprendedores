import { getUserByEmail, createUser, getAllUser, updateUser, removeUser, authenticateUser } from "../model/UserModel.js";

const showAllUser = async (req, res) => {
    try {
        const users = await getAllUser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const userLogin = async (req, res) => {
    const { name, password } = req.body;

    try {
        const data = await authenticateUser(name, password);

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error interno en el servidor', error: error.message });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await getUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }
        await createUser(name, email, password, role);

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        await updateUser(id, name, email, role);
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await removeUser(req.params.id);
        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, showAllUser, editUser, deleteUser, userLogin };
