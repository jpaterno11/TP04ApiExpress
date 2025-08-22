import { pool } from '../configs/db-config.js';

class AlumnosRepository {
    async getAll() {
        try {
            const query = `SELECT 
                            alumnos.id, 
                            alumnos.nombre, 
                            alumnos.apellido, 
                            alumnos.id_curso, 
                            alumnos.fecha_nacimiento, 
                            alumnos.hace_deportes,
                            alumnos.imagen,
                            json_build_object (
                                'id'		, cursos.id,
                                'nombre'    , cursos.nombre
                            ) AS curso
                        FROM alumnos
                        INNER JOIN cursos ON alumnos.id_curso = cursos.id
                        ORDER BY alumnos.id;`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            const query = 'SELECT * FROM alumnos WHERE id = $1';
            const result = await pool.query(query, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async create(alumno) {
        try {
            const sql = ` INSERT INTO alumnos (
                            nombre              , 
                            apellido            , 
                            id_curso            , 
                            fecha_nacimiento    , 
                            hace_deportes       ,
                            imagen
                        ) VALUES (
                            $1, 
                            $2, 
                            $3, 
                            $4, 
                            $5,
                            $6
                        ) RETURNING id`;
            const values =  [   entity?.nombre              ?? '', 
                                entity?.apellido            ?? '', 
                                entity?.id_curso            ?? 0, 
                                entity?.fecha_nacimiento    ?? null, 
                                entity?.hace_deportes       ?? 0,
                                entity?.imagen              ?? null,
                            ];
            const resultPg = await this.getDBPool().query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            throw error;
        }
    }

    async update(id, alumno) {
        let rowsAffected = 0;
        let id = entity.id;
        
        try {
            const previousEntity = await this.getByIdAsync(id);
            if (previousEntity== null) return 0;
            const sql = `UPDATE alumnos SET 
                            nombre              = $2, 
                            apellido            = $3, 
                            id_curso            = $4, 
                            fecha_nacimiento    = $5, 
                            hace_deportes       = $6,
                            imagen              = $7
                        WHERE id = $1`;
                            
            const values =  [   id,     // $1
                                entity?.nombre              ?? previousEntity?.nombre, 
                                entity?.apellido            ?? previousEntity?.apellido, 
                                entity?.id_curso            ?? previousEntity?.id_curso, 
                                entity?.fecha_nacimiento    ?? previousEntity?.fecha_nacimiento, 
                                entity?.hace_deportes       ?? previousEntity?.hace_deportes,
                                entity?.imagen              ?? previousEntity?.imagen,
                            ];
            const resultPg = await this.getDBPool().query(sql, values);

            rowsAffected = resultPg.rowCount;
        } catch (error) {
            throw error;
        }
    }

    delete = async (id) => {
        console.log(`AlumnosRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;
        
        try {
            const sql = `DELETE from alumnos WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }

    async getByGrupo(grupoId) {
        try {
            const query = 'SELECT * FROM alumnos WHERE grupo_id = $1 ORDER BY apellido, nombre';
            const result = await pool.query(query, [grupoId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

export default new AlumnosRepository();
