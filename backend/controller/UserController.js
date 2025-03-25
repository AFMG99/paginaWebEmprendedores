import { getUserByEmail, createUser } from "../model/UserModel.js";

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

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

export { registerUser };
