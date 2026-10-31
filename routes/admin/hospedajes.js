var express = require('express');
var router = express.Router();
var hospedajesModel = require('./../../models/hospedajesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* Listar los hospedajes */
router.get('/', async function (req, res, next) {

  var hospedajes = await hospedajesModel.getHospedajes();

  hospedajes = hospedajes.map(hospedaje => {
    if (hospedaje.img_id) {
      const imagen = cloudinary.image(hospedaje.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return { ...hospedaje, imagen };
    } else {
      return { ...hospedaje, imagen: '' };
    }
  });

  res.render('admin/hospedajes/index', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    hospedajes,
    migas: [
      { label: 'Panel', url: '/admin/home' },
      { label: 'Hospedajes' }
    ]
  });
});

/* Formulario para agregar hospedaje */
router.get('/agregar', async function (req, res, next) {
  res.render('admin/hospedajes/agregar', {
    layout: 'admin/layout',
    migas: [
      { label: 'Panel', url: '/admin/home' },
      { label: 'Hospedajes', url: '/admin/hospedajes' },
      { label: 'Agregar' }
    ]
  });
});

/* Guardar el hospedaje nuevo */
router.post('/agregar', async (req, res, next) => {
  try {
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.nombre != "" && req.body.slug != "" && req.body.descripcion != "") {
      await hospedajesModel.insertHospedaje({
        ...req.body,
        img_id
      });
      res.redirect('/admin/hospedajes')
    } else {
      res.render('admin/hospedajes/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Nombre, slug y descripción son requeridos',
        migas: [
          { label: 'Panel', url: '/admin/home' },
          { label: 'Hospedajes', url: '/admin/hospedajes' },
          { label: 'Agregar' }
        ]
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/hospedajes/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargó el hospedaje',
      migas: [
        { label: 'Panel', url: '/admin/home' },
        { label: 'Hospedajes', url: '/admin/hospedajes' },
        { label: 'Agregar' }
      ]
    })
  }
})

/* Eliminar hospedaje por id */
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  let hospedaje = await hospedajesModel.getHospedajeById(id);
  if (hospedaje.img_id) {
    await (destroy(hospedaje.img_id));
  }

  await hospedajesModel.deleteHospedaje(id);
  res.redirect('/admin/hospedajes');
})

/* Formulario de modificar, precargado */
router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;

  var hospedaje = await hospedajesModel.getHospedajeById(id);
  res.render('admin/hospedajes/modificar', {
    layout: 'admin/layout',
    hospedaje,
    migas: [
      { label: 'Panel', url: '/admin/home' },
      { label: 'Hospedajes', url: '/admin/hospedajes' },
      { label: 'Modificar' }
    ]
  })
})

/* Guardar los cambios del hospedaje */
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
      capacidad_max: req.body.capacidad_max,
      precio_base: req.body.precio_base,
      tipo: req.body.tipo,
      horario_ingreso: req.body.horario_ingreso,
      tags: req.body.tags,
      mapa_url: req.body.mapa_url,
      img_id
    }

    await hospedajesModel.modificarHospedajeById(obj, req.body.id);
    res.redirect('/admin/hospedajes');

  } catch (error) {
    console.log(error);
    res.render('admin/hospedajes/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modificó el hospedaje',
      migas: [
        { label: 'Panel', url: '/admin/home' },
        { label: 'Hospedajes', url: '/admin/hospedajes' },
        { label: 'Modificar' }
      ]
    })
  }
})

module.exports = router;