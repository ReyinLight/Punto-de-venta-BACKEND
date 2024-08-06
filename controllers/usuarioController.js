import connection from '../config/db.js';

// Obtener todos los usuarios
export const getAllUsuarios = async (req, res, next) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM usuario');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res, next) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM usuario WHERE id = ?', [req.params.id]);
        const usuario = rows[0];
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Obtener un usuario por email
export const getUsuarioByEmail= async (req, res, next) => {
    try {
        
        const [rows] = await connection.execute('SELECT * FROM usuario WHERE email = ?', [req.params.email]);
        const usuario = rows[0];
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(204).send();
        }
    } catch (error) {
        next(error);
    }
};


// Crear un nuevo usuario
export const createUsuario = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Datos de entrada inválidos' });
        }

        // Verificar si el email ya existe
        const [existingUsers] = await connection.execute(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Correo electrónico ya existe' });
        }

        const [result] = await connection.execute(
            'INSERT INTO usuario (nombre, email, phone) VALUES (?, ?, ?)',
            [name, email, phone]
        );
        const newUser = { id: result.insertId, name, email, phone };
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        next(error);
    }
};

// Actualizar un usuario
export const updateUsuario = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const userId = req.params.id;

        if (!name && !email && !phone) {
            return res.status(400).json({ error: 'Datos de entrada inválidos' });
        }

        // Verificar si el correo electrónico o teléfono ya existen
        const [existingUsers] = await connection.execute(
            'SELECT * FROM usuarios WHERE (email = ? OR phone = ?) AND id != ?',
            [email, phone, userId]
        );
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Correo electrónico o teléfono ya existe' });
        }

        // Solo actualiza los campos que se proporcionan
        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (phone) {
            updateFields.push('phone = ?');
            values.push(phone);
        }

        values.push(userId); // Agrega el ID al final para la cláusula WHERE

        const query = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await connection.execute(query, values);

        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado', usuario: { id: userId, name, email, phone } });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res, next) => {
    try {
        const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};
