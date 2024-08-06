import connection from '../config/db.js';

// Obtener todos los artículos
export const getAllArticulos = async (req, res, next) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM articulo');

        const baseURL = 'http://localhost:3001/imagenes/';
        const articlesWithImageURL = rows.map(row => ({
           ...row,
            imagenURL: `${baseURL}${row.id}.jpg`
        })); 
        res.json(articlesWithImageURL);

    } catch (error) {
        next(error);
    }
};

// Obtener un artículo por ID
export const getArticuloById = async (req, res, next) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM articulo WHERE id = ?', [req.params.id]);
        const articulo = rows[0];
        if (articulo) {
            const baseURL = 'http://localhost:3001/imagenes/';
            articulo.imagenURL = `${baseURL}${articulo.id}.jpg`;
            res.json(articulo);
        } else {
            res.status(404).json({ error: 'Artículo no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo artículo
export const createArticulo = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, existencia } = req.body;

        if (!nombre || !descripcion || precio === undefined || existencia === undefined) {
            return res.status(400).json({ error: 'Datos de entrada inválidos' });
        }

        const [result] = await connection.execute('INSERT INTO articulos (nombre, descripcion, precio, existencia) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, existencia]);
        const newArticulo = { id: result.insertId, nombre, descripcion, precio, existencia };
        newArticulo.imagenURL = `http://localhost:3001/imagenes/${newArticulo.id}.jpg`;
        res.status(201).json(newArticulo);
    } catch (error) {
        next(error);
    }
};

// Actualizar un artículo
export const updateArticulo = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, existencia } = req.body;

        if (!nombre || !descripcion || precio === undefined || existencia === undefined) {
            return res.status(400).json({ error: 'Datos de entrada inválidos' });
        }

        const [result] = await connection.execute('UPDATE articulos SET nombre = ?, descripcion = ?, precio = ?, existencia = ? WHERE id = ?', [nombre, descripcion, precio, existencia, req.params.id]);
        if (result.affectedRows > 0) {
            const updatedArticulo = { id: req.params.id, nombre, descripcion, precio, existencia };
            updatedArticulo.imagenURL = `http://localhost:3001/imagenes/${req.params.id}.jpg`;
            res.json({ message: 'Artículo actualizado', articulo: updatedArticulo });
        } else {
            res.status(404).json({ error: 'Artículo no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un artículo
export const deleteArticulo = async (req, res, next) => {
    try {
        const [result] = await connection.execute('DELETE FROM articulos WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Registro eliminado' });
        } else {
            res.status(404).json({ error: 'Artículo no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};
