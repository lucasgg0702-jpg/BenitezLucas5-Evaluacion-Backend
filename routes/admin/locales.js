var express = require('express');
var router = express.Router();
var localesModel = require('./../../models/localesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* Listar los locales */
router.get('/', async function (req, res, next) {

  var locales = await localesModel.getLocales();

  locales = locales.map(local => {
    if (local.img_id) {
      const imagen = cloudinary.image(local.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return { ...local, imagen };
    } else {
      return { ...local, imagen: '' };
    }
  });

  res.render('admin/locales/index', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    locales,
    migas: [
      { label: 'Panel', url: '/admin/home' },
      { label: 'Locales' }
    ]
  });
});

/* Formulario para agregar local */
router.get('/agregar', async function (req, res, next) {
  res.render('admin/locales/agregar', {
    layout: 'admin/layout',
    migas: [
      { label: 'Panel', url: '/admin/home' },
      { label: 'Locales', url: '/admin/locales' },
      { label: 'Agregar' }
    ]
  });
});

/* Guardar el local nuevo */
router.post('/agregar', async (req, res, next) => {
  try {
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.nombre != "" && req.body.slug != "" && req.body.descripcion != "") {
      await localesModel.insertLocal({
        ...req.body,
        img_id
      });
      res.redirect('/admin/locales')
    } else {
      res.render('admin/locales/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Nombre, slug y descripción son requeridos',
        migas: [
          { label: 'Panel', url: '/admin/home' },
          { label: 'Locales', url: '/admin/locales' },
          { label: 'Agregar' }
        ]
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/locales/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargó el local',
      migas: [
        { label: 'Panel', url: '/admin/home' },
        { label: 'Locales', url: '/admin/locales' },
        { label: 'Agregar' }
      ]
    })
  }
})

/* Eliminar local por id */
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  let local = await localesModel.getLocalById(id);
  if (local.img_id) {
    await (destroy(local.img_id));
  }

  await localesModel.deleteLocal(id);
  res.redirect('/admin/locales');
})

/* Formulario de modificar, precargado */
router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;

  var local = await localesModel.getLocalById(id);
  res.render('admin/locales/modificar', {
    layout: 'admin/layout',
    local,
    migas: [
      { label: 'Panel', url: '/admin/home' },
      { label: 'Locales', url: '/admin/locales' },
      { label: 'Modificar' }
    ]
  })
})

/* Guardar los cambios del local */
router.post('/modificar', async (req, res, next) => {
  try {
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }
    var obj = {
      nombre: req.body.nombre,
      slug: req.body.slug,
      descripcion: req.body.descripcion,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      horario: req.body.horario,
      tags: req.body.tags,
      mapa_url: req.body.mapa_url,
      delivery_precio: req.body.delivery_precio || null,
      img_id
    }

    await localesModel.modificarLocalById(obj, req.body.id);
    res.redirect('/admin/locales');

  } catch (error) {
    console.log(error);
    res.render('admin/locales/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modificó el local',
      migas: [
        { label: 'Panel', url: '/admin/home' },
        { label: 'Locales', url: '/admin/locales' },
        { label: 'Modificar' }
      ]
    })
  }
})

module.exports = router;