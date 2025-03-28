import { getConnection, sql } from '../conf/database.js';
import bcrypt from 'bcrypt';

const getAllUser = async () => {
    try {
        const result = await sql.query('SELECT * FROM Usuarios');
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

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

const authenticateUser = async (name, password) => {
    try {
        await getConnection();
        const result = await new sql.Request()
            .input('name', sql.VarChar, name)
            .input('password', sql.VarChar, password)
            .query(`SELECT id, name, email, role FROM Usuarios WHERE name = @name AND password = @password`);

        return result.recordset.length > 0 ? result.recordset : [];
    } catch (error) {
        throw new Error('Error en la consulta SQL: ' + error.message);
    }
};

const createUser = async (name, email, password, role = "Usuario") => {
    try {

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
};

const updateUser = async (id, name, email, role) => {
    await getConnection();
    try {
        await new sql.Request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('role', sql.VarChar, role)
            .query(
                `UPDATE Usuarios
                SET name = @name, email = @email, role = @role
                WHERE id = @id`
            );
        return { message: "Usuario actualizado correctamente" };
    } catch (error) {
        throw new Error('Error en la consulta SQL: ' + error.message);
    }
};

const removeUser = async (id) => {
    await getConnection();
    try {
        await new sql.Request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM Usuarios WHERE id = @id`);
            return { message: "Usuario eliminado correctamente" };
    } catch (error) {
        throw new Error('Error en la consulta SQL: ' + error.message);
    }
};

export { createUser, getUserByEmail, getAllUser, updateUser, removeUser, authenticateUser };