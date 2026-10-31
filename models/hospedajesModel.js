var pool = require('./bd');

async function getHospedajes() {
    var query = 'select * from hospedajes';
    var rows = await pool.query(query);
    return rows;
}

async function getHospedajeById(id) {
    var query = 'select * from hospedajes where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function getHospedajeBySlug(slug) {
    var query = 'select * from hospedajes where slug = ? limit 1';
    var rows = await pool.query(query, [slug]);
    return rows[0];
}

async function insertHospedaje(obj) {
    try {
        var query = 'insert into hospedajes set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarHospedajeById(obj, id) {
    try {
        var query = 'update hospedajes set ? where id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteHospedaje(id) {
    var query = 'delete from hospedajes where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getHospedajes, getHospedajeById, getHospedajeBySlug, insertHospedaje, modificarHospedajeById, deleteHospedaje };