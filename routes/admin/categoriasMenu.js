var express = require('express');
var router = express.Router({ mergeParams: true });
var categoriasMenuModel = require('./../../models/categoriasMenuModel');
var localesModel = require('./../../models/localesModel');

function migasIndex(local) {
  return [
    { label: 'Panel', url: '/admin/home' },
    { label: 'Locales', url: '/admin/locales' },
    { label: local.nombre, url: `/admin/locales/modificar/${local.id}` },
    { label: 'Menú' }
  ];
}

function migasSub(local, actual) {
  return [
    { label: 'Panel', url: '/admin/home' },
    { label: 'Locales', url: '/admin/locales' },
    { label: local.nombre, url: `/admin/locales/modificar/${local.id}` },
    { label: 'Menú', url: `/admin/locales/${local.id}/menu` },
    { label: actual }
  ];
}

/* Listar categorías de un local */
router.get('/', async function (req, res, next) {
  var localId = req.params.localId;
  var local = await localesModel.getLocalById(localId);
  var categorias = await categoriasMenuModel.getCategoriasByLocalId(localId);

  res.render('admin/menu/index', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    local,
    categorias,
    migas: migasIndex(local)
  });
});

/* Formulario agregar categoría */
router.get('/agregar', async function (req, res, next) {
  var local = await localesModel.getLocalById(req.params.localId);
  res.render('admin/menu/agregar', {
    layout: 'admin/layout',
    local,
    migas: migasSub(local, 'Agregar')
  });
});

/* Guardar categoría nueva */
router.post('/agregar', async (req, res, next) => {
  var localId = req.params.localId;
  var local = await localesModel.getLocalById(localId);
  try {
    if (req.body.titulo != "" && req.body.slug != "") {
      await categoriasMenuModel.insertCategoria({
        local_id: localId,
        titulo: req.body.titulo,
        slug: req.body.slug,
        avisos: req.body.avisos,
        orden: req.body.orden || 0
      });
      res.redirect(`/admin/locales/${localId}/menu`);
    } else {
      res.render('admin/menu/agregar', {
        layout: 'admin/layout',
        local,
        error: true,
        message: 'Título y slug son requeridos',
        migas: migasSub(local, 'Agregar')
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/menu/agregar', {
      layout: 'admin/layout',
      local,
      error: true,
      message: 'No se cargó la categoría',
      migas: migasSub(local, 'Agregar')
    });
  }
});

/* Eliminar categoría */
router.get('/eliminar/:id', async (req, res, next) => {
  var localId = req.params.localId;
  await categoriasMenuModel.deleteCategoria(req.params.id);
  res.redirect(`/admin/locales/${localId}/menu`);
});

/* Formulario modificar categoría */
router.get('/modificar/:id', async (req, res, next) => {
  var local = await localesModel.getLocalById(req.params.localId);
  var categoria = await categoriasMenuModel.getCategoriaById(req.params.id);
  res.render('admin/menu/modificar', {
    layout: 'admin/layout',
    local,
    categoria,
    migas: migasSub(local, 'Modificar')
  });
});

/* Guardar cambios de categoría */
router.post('/modificar', async (req, res, next) => {
  var localId = req.params.localId;
  var local = await localesModel.getLocalById(localId);
  try {
    var obj = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      avisos: req.body.avisos,
      orden: req.body.orden || 0
    };
    await categoriasMenuModel.modificarCategoriaById(obj, req.body.id);
    res.redirect(`/admin/locales/${localId}/menu`);
  } catch (error) {
    console.log(error);
    var categoria = await categoriasMenuModel.getCategoriaById(req.body.id);
    res.render('admin/menu/modificar', {
      layout: 'admin/layout',
      local,
      categoria,
      error: true,
      message: 'No se modificó la categoría',
      migas: migasSub(local, 'Modificar')
    });
  }
});

module.exports = router;