var pool = require('./bd');

async function getCategoriasByLocalId(local_id) {
    var query = 'select * from categorias_menu where local_id = ? order by orden, id';
    var rows = await pool.query(query, [local_id]);
    return rows;
}

async function getCategoriaById(id) {
    var query = 'select * from categorias_menu where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function insertCategoria(obj) {
    try {
        var query = 'insert into categorias_menu set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarCategoriaById(obj, id) {
    try {
        var query = 'update categorias_menu set ? where id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteCategoria(id) {
    var query = 'delete from categorias_menu where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getCategoriasByLocalId, getCategoriaById, insertCategoria, modificarCategoriaById, deleteCategoria };