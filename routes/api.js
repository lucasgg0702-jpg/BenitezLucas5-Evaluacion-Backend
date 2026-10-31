var express = require('express');
var router = express.Router();
var localesModel = require('./../models/localesModel');
var categoriasMenuModel = require('./../models/categoriasMenuModel');
var itemsMenuModel = require('./../models/itemsMenuModel');
var hospedajesModel = require('./../models/hospedajesModel');
var habitacionesModel = require('./../models/habitacionesModel');
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

router.get('/locales', async function (req, res, next) {
    let locales = await localesModel.getLocales();

    locales = locales.map(local => {
        if (local.img_id) {
            const imagen = cloudinary.url(local.img_id, {
                width: 800,
                height: 500,
                crop: 'fill'
            });
            return { ...local, imagen };
        } else {
            return { ...local, imagen: '' };
        }
    });
    res.json(locales);
});

router.get('/locales/:slug/menu', async function (req, res, next) {
    try {
        var local = await localesModel.getLocalBySlug(req.params.slug);

        if (!local) {
            return res.status(404).json({ error: true, message: 'Local no encontrado' });
        }

        var categorias = await categoriasMenuModel.getCategoriasByLocalId(local.id);

        categorias = await Promise.all(categorias.map(async (categoria) => {
            var items = await itemsMenuModel.getItemsByCategoriaId(categoria.id);

            items = items.map(item => ({
                ...item,
                precio: Number(item.precio),
                imagen: item.img_id ? cloudinary.url(item.img_id, { width: 400, height: 300, crop: 'fill' }) : ''
            }));

            return {
                ...categoria,
                avisos: categoria.avisos ? categoria.avisos.split('|') : [],
                items
            };
        }));

        res.json({
            local: {
                nombre: local.nombre,
                telefono: local.telefono,
                menu_pdf_url: local.menu_pdf_url
            },
            categorias
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: 'Error al obtener el menú' });
    }
});

router.get('/hospedajes', async function (req, res, next) {
    let hospedajes = await hospedajesModel.getHospedajes();

    hospedajes = hospedajes.map(hospedaje => {
        if (hospedaje.img_id) {
            const imagen = cloudinary.url(hospedaje.img_id, {
                width: 800,
                height: 500,
                crop: 'fill'
            });
            return { ...hospedaje, imagen };
        } else {
            return { ...hospedaje, imagen: '' };
        }
    });
    res.json(hospedajes);
});

router.get('/hospedajes/:slug/habitaciones', async function (req, res, next) {
    try {
        var hospedaje = await hospedajesModel.getHospedajeBySlug(req.params.slug);

        if (!hospedaje) {
            return res.status(404).json({ error: true, message: 'Hospedaje no encontrado' });
        }

        var habitaciones = await habitacionesModel.getHabitacionesByHospedajeId(hospedaje.id);

        habitaciones = habitaciones.map(h => ({
            ...h,
            precio: Number(h.precio),
            imagen: h.img_id ? cloudinary.url(h.img_id, { width: 500, height: 350, crop: 'fill' }) : ''
        }));

        res.json({
            hospedaje: {
                nombre: hospedaje.nombre,
                telefono: hospedaje.telefono
            },
            habitaciones
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: 'Error al obtener las habitaciones' });
    }
});

router.post('/contacto', async (req, res) => {
    const mail = {
        to: 'lucasgg0702@gmal.com',
        subject: 'Contacto Web - Comé en Alvear',
        html: `${req.body.nombre} se contactó a través de la web y quiere más información a este correo: ${req.body.email} <br>
        Además, hizo el siguiente comentario: ${req.body.mensaje} <br> Su teléfono es: ${req.body.telefono}`
    }

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    try {
        await transport.sendMail(mail)
        res.status(201).json({
            error: false,
            message: 'Mensaje Enviado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'No se pudo enviar el mensaje'
        });
    }
});

module.exports = router;