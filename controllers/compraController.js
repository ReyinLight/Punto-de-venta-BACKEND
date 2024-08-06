import connection from '../config/db.js';

// Obtener todas las compras
export const getAllCompras = async (req, res, next) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM compra');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        next(error);
    }
};

// Obtener una compra por ID
export const getCompraById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.execute('SELECT * FROM compra WHERE id = ?', [id]);
        const compra = rows[0];
        if (compra) {
            res.json(compra);
        } else {
            res.status(404).json({ error: 'Compra no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la compra:', error);
        next(error);
    }
};


export const getHistorial = async (req, res, next) => {

    try {
        const [rows] = await connection.execute('SELECT * FROM vistahistorial');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching historial:', error);
        res.status(500).json({ error: 'Error al obtener el historial' });
        next(error);
    }
};

export const crearCompra = async (req, res, next) => {
    const usuario = req.body.usuario;
    const productoId = req.body.productoId;

    try {
        // Llamar al stored procedure para validar o crear el cliente
        const [rows] = await connection.execute(
            'CALL ValidarCliente(?, ?, ?, @idCliente)',
            [usuario.name, usuario.email, usuario.phone]
        );
        
        // Obtener el ID del cliente de la variable de salida
        const [[{ idCliente }]] = await connection.query('SELECT @idCliente AS idCliente');
        
        // Llamar al stored procedure para crear la compra
        const [result] = await connection.execute(
            'CALL CrearCompra(?, ?)',
            [idCliente, productoId]
        );

        // Responder con los detalles de la nueva compra
        res.status(201).json({ message: 'Compra realizada con éxito' });
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(400).json({ error: error.message });
        next(error);
    }
};


// Crear una nueva compra
export const createCompra = async (req, res, next) => {
    try {
        const { usuarioId, productoId, cantidad } = req.body;

        if (!usuarioId || !productoId || cantidad === undefined) {
            console.log('Datos de entrada inválidos:', req.body);
            return res.status(400).json({ error: 'Datos de entrada inválidos' });
        }

        // Verifica si el usuario y el producto existen
        const [userRows] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
        if (userRows.length === 0) {
            console.log('Usuario no encontrado:', usuarioId);
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const [productRows] = await connection.execute('SELECT * FROM articulos WHERE id = ?', [productoId]);
        if (productRows.length === 0) {
            console.log('Producto no encontrado:', productoId);
            return res.status(400).json({ error: 'Producto no encontrado' });
        }

        // Inserta la nueva compra en la base de datos
        const [result] = await connection.execute(
            'INSERT INTO compra (usuarioId, productoId, cantidad, fecha) VALUES (?, ?, ?, ?)',
            [usuarioId, productoId, cantidad, new Date()] // Establece la fecha actual
        );

        const newCompra = { id: result.insertId, usuarioId, productoId, cantidad, fecha: new Date() };
        res.status(201).json(newCompra);
    } catch (error) {
        console.error('Error al crear la compra:', error);
        next(error);
    }
};

// Actualizar una compra existente
export const updateCompra = async (req, res, next) => {
    try {
        const { usuarioId, productoId, cantidad } = req.body;
        const { id } = req.params;

        if (!usuarioId || !productoId || cantidad === undefined) {
            return res.status(400).json({ error: 'Datos de entrada inválidos' });
        }

        const [result] = await connection.execute(
            'UPDATE compra SET usuarioId = ?, productoId = ?, cantidad = ?, fecha = ? WHERE id = ?',
            [usuarioId, productoId, cantidad, new Date(), id] // Actualiza la fecha actual
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Compra actualizada', compra: { id, usuarioId, productoId, cantidad, fecha: new Date() } });
        } else {
            res.status(404).json({ error: 'Compra no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la compra:', error);
        next(error);
    }
};

// Eliminar una compra
export const deleteCompra = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await connection.execute('DELETE FROM compra WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Compra eliminada con éxito' });
        } else {
            res.status(404).json({ error: 'Compra no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la compra:', error);
        next(error);
    }
};
