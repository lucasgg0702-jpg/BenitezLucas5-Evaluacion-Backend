var pool = require('./bd');

async function getHabitacionesByHospedajeId(hospedaje_id) {
    var query = 'select * from habitaciones where hospedaje_id = ? order by orden, id';
    var rows = await pool.query(query, [hospedaje_id]);
    return rows;
}

async function getHabitacionById(id) {
    var query = 'select * from habitaciones where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function insertHabitacion(obj) {
    try {
        var query = 'insert into habitaciones set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarHabitacionById(obj, id) {
    try {
        var query = 'update habitaciones set ? where id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteHabitacion(id) {
    var query = 'delete from habitaciones where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getHabitacionesByHospedajeId, getHabitacionById, insertHabitacion, modificarHabitacionById, deleteHabitacion };