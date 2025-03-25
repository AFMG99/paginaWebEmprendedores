import { sql } from '../conf/database.js';
import bcrypt from 'bcrypt';

const getUserByEmail = async (email) => {
    try {
        const request = new sql.Request();
        request.input("email", sql.VarChar, email);

        const result = await request.query(`
            SELECT * FROM Usuarios WHERE email = @email
        `);

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
};

const createUser = async (name, email, password, role = "Usuario") => {
    try {
        // const salt = await bcrypt.getSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const request = new sql.Request();
        request.input("name", sql.VarChar, name);
        request.input("email", sql.VarChar, email);
        request.input("password", sql.VarChar, password);
        request.input("role", sql.VarChar, role);

        await request.query(`
            INSERT INTO Usuarios (name, email, password, role) 
            VALUES (@name, @email, @password, @role)
        `);

        return { message: "Usuario registrado correctamente" };

    } catch (error) {
        throw new Error('Error en la consulta SQL: ' + error.message);
    }
}

export { createUser, getUserByEmail };