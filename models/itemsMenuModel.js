var pool = require('./bd');

async function getItemsByCategoriaId(categoria_id) {
    var query = 'select * from items_menu where categoria_id = ? order by orden, id';
    var rows = await pool.query(query, [categoria_id]);
    return rows;
}

async function getItemById(id) {
    var query = 'select * from items_menu where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function insertItem(obj) {
    try {
        var query = 'insert into items_menu set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarItemById(obj, id) {
    try {
        var query = 'update items_menu set ? where id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteItem(id) {
    var query = 'delete from items_menu where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getItemsByCategoriaId, getItemById, insertItem, modificarItemById, deleteItem };