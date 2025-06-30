import express from "express";
import cors from "cors";
import config from './configs/db-config.js';
import pkg from 'pg';

const { Client } = pkg;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/alumnos', async (req, res) => {
    try {
        const client = new Client(config);
        await client.connect();
        const sql = 'SELECT * FROM alumnos';
        const result = await client.query(sql);
        await client.end();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send("(Internal Server Error) error: " + error.message);
    }
});

app.get('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).send("El ID debe ser numérico.");
    }

    try {
        const client = new Client(config);
        await client.connect();
        const sql = 'SELECT * FROM alumnos WHERE id = $1';
        const result = await client.query(sql, [id]);
        await client.end();

        if (result.rows.length === 0) {
            return res.status(404).send("No existe un alumno con ese ID.");
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send("(Internal Server Error) error: " + error.message);
    }
});

app.post('/api/alumnos', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    try {
        const client = new Client(config);
        await client.connect();
        const sql = `
            INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes];
        await client.query(sql, values);
        await client.end();

        res.status(201).send("Alumno creado correctamente.");
    } catch (error) {
        res.status(500).send("(Internal Server Error) error: " + error.message);
    }
});

app.put('/api/alumnos', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).send("El ID debe ser numérico y estar presente.");
    }

    try {
        const client = new Client(config);
        await client.connect();
        const sql = `
            UPDATE alumnos
            SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5
            WHERE id = $6
        `;
        const values = [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id];
        const result = await client.query(sql, values);
        await client.end();

        if (result.rowCount === 0) {
            return res.status(404).send("No existe un alumno con ese ID.");
        }

        res.status(201).send("Alumno actualizado correctamente.");
    } catch (error) {
        res.status(500).send("(Internal Server Error) error: " + error.message);
    }
});

app.delete('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).send("El ID debe ser numérico.");
    }

    try {
        const client = new Client(config);
        await client.connect();
        const sql = 'DELETE FROM alumnos WHERE id = $1';
        const result = await client.query(sql, [id]);
        await client.end();

        if (result.rowCount === 0) {
            return res.status(404).send("No existe un alumno con ese ID.");
        }

        res.status(200).send("Alumno eliminado correctamente.");
    } catch (error) {
        res.status(500).send("(Internal Server Error) error: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
