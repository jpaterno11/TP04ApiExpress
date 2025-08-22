import { pool } from '../configs/db-config.js';

class CursosRepository {
    async getAll() {
        try {
            const query = 'SELECT * FROM cursos ORDER BY id';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            const query = 'SELECT * FROM cursos WHERE id = $1';
            const result = await pool.query(query, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async create(curso) {
        try {
            const { nombre, descripcion, duracion, precio } = curso;
            const query = `
                INSERT INTO cursos (nombre, descripcion, duracion, precio) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *
            `;
            const values = [nombre, descripcion, duracion, precio];
            
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async update(id, curso) {
        try {
            const { nombre, descripcion, duracion, precio } = curso;
            const query = `
                UPDATE cursos 
                SET nombre = $1, descripcion = $2, duracion = $3, precio = $4 
                WHERE id = $5 
                RETURNING *
            `;
            const values = [nombre, descripcion, duracion, precio, id];
            
            const result = await pool.query(query, values);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const query = 'DELETE FROM cursos WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getByDuracion(minDuracion, maxDuracion) {
        try {
            const query = 'SELECT * FROM cursos WHERE duracion BETWEEN $1 AND $2 ORDER BY duracion';
            const result = await pool.query(query, [minDuracion, maxDuracion]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

export default new CursosRepository();
