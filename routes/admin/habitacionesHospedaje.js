var express = require('express');
var router = express.Router({ mergeParams: true });
var habitacionesModel = require('./../../models/habitacionesModel');
var hospedajesModel = require('./../../models/hospedajesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

function migasIndex(hospedaje) {
  return [
    { label: 'Panel', url: '/admin/home' },
    { label: 'Hospedajes', url: '/admin/hospedajes' },
    { label: hospedaje.nombre, url: `/admin/hospedajes/modificar/${hospedaje.id}` },
    { label: 'Habitaciones' }
  ];
}

function migasSub(hospedaje, actual) {
  return [
    { label: 'Panel', url: '/admin/home' },
    { label: 'Hospedajes', url: '/admin/hospedajes' },
    { label: hospedaje.nombre, url: `/admin/hospedajes/modificar/${hospedaje.id}` },
    { label: 'Habitaciones', url: `/admin/hospedajes/${hospedaje.id}/habitaciones` },
    { label: actual }
  ];
}

/* Listar habitaciones de un hospedaje */
router.get('/', async function (req, res, next) {
  var hospedajeId = req.params.hospedajeId;
  var hospedaje = await hospedajesModel.getHospedajeById(hospedajeId);
  var habitaciones = await habitacionesModel.getHabitacionesByHospedajeId(hospedajeId);

  habitaciones = habitaciones.map(h => {
    if (h.img_id) {
      const imagen = cloudinary.image(h.img_id, { width: 100, height: 100, crop: 'fill' });
      return { ...h, imagen };
    }
    return { ...h, imagen: '' };
  });

  res.render('admin/habitaciones/index', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    hospedaje,
    habitaciones,
    migas: migasIndex(hospedaje)
  });
});

/* Formulario agregar habitación */
router.get('/agregar', async (req, res, next) => {
  var hospedaje = await hospedajesModel.getHospedajeById(req.params.hospedajeId);
  res.render('admin/habitaciones/agregar', {
    layout: 'admin/layout',
    hospedaje,
    migas: migasSub(hospedaje, 'Agregar')
  });
});

/* Guardar habitación nueva */
router.post('/agregar', async (req, res, next) => {
  var hospedajeId = req.params.hospedajeId;
  var hospedaje = await hospedajesModel.getHospedajeById(hospedajeId);
  try {
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.numero != "" && req.body.capacidad != "" && req.body.precio != "") {
      await habitacionesModel.insertHabitacion({
        hospedaje_id: hospedajeId,
        numero: req.body.numero,
        capacidad: req.body.capacidad,
        precio: req.body.precio,
        comodidades: req.body.comodidades,
        orden: req.body.orden || 0,
        img_id
      });
      res.redirect(`/admin/hospedajes/${hospedajeId}/habitaciones`);
    } else {
      res.render('admin/habitaciones/agregar', {
        layout: 'admin/layout',
        hospedaje,
        error: true,
        message: 'Número, capacidad y precio son requeridos',
        migas: migasSub(hospedaje, 'Agregar')
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/habitaciones/agregar', {
      layout: 'admin/layout',
      hospedaje,
      error: true,
      message: 'No se cargó la habitación',
      migas: migasSub(hospedaje, 'Agregar')
    });
  }
});

/* Eliminar habitación */
router.get('/eliminar/:id', async (req, res, next) => {
  var hospedajeId = req.params.hospedajeId;
  var habitacion = await habitacionesModel.getHabitacionById(req.params.id);
  if (habitacion.img_id) {
    await destroy(habitacion.img_id);
  }
  await habitacionesModel.deleteHabitacion(req.params.id);
  res.redirect(`/admin/hospedajes/${hospedajeId}/habitaciones`);
});

/* Formulario modificar habitación */
router.get('/modificar/:id', async (req, res, next) => {
  var hospedaje = await hospedajesModel.getHospedajeById(req.params.hospedajeId);
  var habitacion = await habitacionesModel.getHabitacionById(req.params.id);
  res.render('admin/habitaciones/modificar', {
    layout: 'admin/layout',
    hospedaje,
    habitacion,
    migas: migasSub(hospedaje, 'Modificar')
  });
});

/* Guardar cambios de habitación */
router.post('/modificar', async (req, res, next) => {
  var hospedajeId = req.params.hospedajeId;
  var hospedaje = await hospedajesModel.getHospedajeById(hospedajeId);
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
      numero: req.body.numero,
      capacidad: req.body.capacidad,
      precio: req.body.precio,
      comodidades: req.body.comodidades,
      orden: req.body.orden || 0,
      img_id
    };

    await habitacionesModel.modificarHabitacionById(obj, req.body.id);
    res.redirect(`/admin/hospedajes/${hospedajeId}/habitaciones`);
  } catch (error) {
    console.log(error);
    var habitacion = await habitacionesModel.getHabitacionById(req.body.id);
    res.render('admin/habitaciones/modificar', {
      layout: 'admin/layout',
      hospedaje,
      habitacion,
      error: true,
      message: 'No se modificó la habitación',
      migas: migasSub(hospedaje, 'Modificar')
    });
  }
});

module.exports = router;