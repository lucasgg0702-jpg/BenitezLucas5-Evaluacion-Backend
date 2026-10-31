var pool = require('./bd');

async function getLocales() {
    var query = 'select * from locales';
    var rows = await pool.query(query);
    return rows;
}

async function getLocalById(id) {
    var query = 'select * from locales where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function getLocalBySlug(slug) {
    var query = 'select * from locales where slug = ? limit 1';
    var rows = await pool.query(query, [slug]);
    return rows[0];
}

async function insertLocal(obj) {
    try {
        var query = 'insert into locales set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarLocalById(obj, id) {
    try {
        var query = 'update locales set ? where id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteLocal(id) {
    var query = 'delete from locales where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getLocales, getLocalById, getLocalBySlug, insertLocal, modificarLocalById, deleteLocal };