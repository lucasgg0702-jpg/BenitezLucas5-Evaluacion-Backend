var express = require('express');
var router = express.Router({ mergeParams: true });
var itemsMenuModel = require('./../../models/itemsMenuModel');
var categoriasMenuModel = require('./../../models/categoriasMenuModel');
var localesModel = require('./../../models/localesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

function migasIndex(local, categoria) {
  return [
    { label: 'Panel', url: '/admin/home' },
    { label: 'Locales', url: '/admin/locales' },
    { label: local.nombre, url: `/admin/locales/modificar/${local.id}` },
    { label: 'Menú', url: `/admin/locales/${local.id}/menu` },
    { label: categoria.titulo }
  ];
}

function migasSub(local, categoria, actual) {
  return [
    { label: 'Panel', url: '/admin/home' },
    { label: 'Locales', url: '/admin/locales' },
    { label: local.nombre, url: `/admin/locales/modificar/${local.id}` },
    { label: 'Menú', url: `/admin/locales/${local.id}/menu` },
    { label: categoria.titulo, url: `/admin/locales/${local.id}/menu/${categoria.id}/items` },
    { label: actual }
  ];
}

/* Listar ítems de una categoría */
router.get('/', async function (req, res, next) {
  var { localId, categoriaId } = req.params;
  var local = await localesModel.getLocalById(localId);
  var categoria = await categoriasMenuModel.getCategoriaById(categoriaId);
  var items = await itemsMenuModel.getItemsByCategoriaId(categoriaId);

  items = items.map(item => {
    if (item.img_id) {
      const imagen = cloudinary.image(item.img_id, { width: 100, height: 100, crop: 'fill' });
      return { ...item, imagen };
    }
    return { ...item, imagen: '' };
  });

  res.render('admin/menu/items/index', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    local,
    categoria,
    items,
    migas: migasIndex(local, categoria)
  });
});

/* Formulario agregar ítem */
router.get('/agregar', async (req, res, next) => {
  var { localId, categoriaId } = req.params;
  var local = await localesModel.getLocalById(localId);
  var categoria = await categoriasMenuModel.getCategoriaById(categoriaId);
  res.render('admin/menu/items/agregar', {
    layout: 'admin/layout',
    local,
    categoria,
    migas: migasSub(local, categoria, 'Agregar')
  });
});

/* Guardar ítem nuevo */
router.post('/agregar', async (req, res, next) => {
  var { localId, categoriaId } = req.params;
  var local = await localesModel.getLocalById(localId);
  var categoria = await categoriasMenuModel.getCategoriaById(categoriaId);
  try {
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.nombre != "" && req.body.precio != "") {
      await itemsMenuModel.insertItem({
        categoria_id: categoriaId,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        orden: req.body.orden || 0,
        img_id
      });
      res.redirect(`/admin/locales/${localId}/menu/${categoriaId}/items`);
    } else {
      res.render('admin/menu/items/agregar', {
        layout: 'admin/layout',
        local,
        categoria,
        error: true,
        message: 'Nombre y precio son requeridos',
        migas: migasSub(local, categoria, 'Agregar')
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/menu/items/agregar', {
      layout: 'admin/layout',
      local,
      categoria,
      error: true,
      message: 'No se cargó el ítem',
      migas: migasSub(local, categoria, 'Agregar')
    });
  }
});

/* Eliminar ítem */
router.get('/eliminar/:id', async (req, res, next) => {
  var { localId, categoriaId } = req.params;
  var item = await itemsMenuModel.getItemById(req.params.id);
  if (item.img_id) {
    await destroy(item.img_id);
  }
  await itemsMenuModel.deleteItem(req.params.id);
  res.redirect(`/admin/locales/${localId}/menu/${categoriaId}/items`);
});

/* Formulario modificar ítem */
router.get('/modificar/:id', async (req, res, next) => {
  var { localId, categoriaId } = req.params;
  var local = await localesModel.getLocalById(localId);
  var categoria = await categoriasMenuModel.getCategoriaById(categoriaId);
  var item = await itemsMenuModel.getItemById(req.params.id);
  res.render('admin/menu/items/modificar', {
    layout: 'admin/layout',
    local,
    categoria,
    item,
    migas: migasSub(local, categoria, 'Modificar')
  });
});

/* Guardar cambios del ítem */
router.post('/modificar', async (req, res, next) => {
  var { localId, categoriaId } = req.params;
  var local = await localesModel.getLocalById(localId);
  var categoria = await categoriasMenuModel.getCategoriaById(categoriaId);
  try {
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
      borrar_img_vieja = true;
    }
    if (borrar_img_vieja && req.body.img_original) {
      await destroy(req.body.img_original);
    }

    var obj = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      orden: req.body.orden || 0,
      img_id
    };

    await itemsMenuModel.modificarItemById(obj, req.body.id);
    res.redirect(`/admin/locales/${localId}/menu/${categoriaId}/items`);
  } catch (error) {
    console.log(error);
    var item = await itemsMenuModel.getItemById(req.body.id);
    res.render('admin/menu/items/modificar', {
      layout: 'admin/layout',
      local,
      categoria,
      item,
      error: true,
      message: 'No se modificó el ítem',
      migas: migasSub(local, categoria, 'Modificar')
    });
  }
});

module.exports = router;