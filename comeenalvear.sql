-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-10-2026 a las 20:30:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `comeenalvear`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_menu`
--

CREATE TABLE `categorias_menu` (
  `id` int(11) NOT NULL,
  `local_id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `avisos` text DEFAULT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_menu`
--

INSERT INTO `categorias_menu` (`id`, `local_id`, `titulo`, `slug`, `avisos`, `orden`) VALUES
(2, 5, 'Sandwiches', 'sandwiches', '', 3),
(3, 5, 'Empanadas', 'empanadas', '', 2),
(4, 5, 'Hamburguesas', 'hamburguesas', '', 1),
(5, 5, 'Para picar', 'para-picar', '', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `hospedaje_id` int(11) NOT NULL,
  `numero` varchar(150) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `comodidades` text DEFAULT NULL,
  `img_id` varchar(250) DEFAULT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `hospedaje_id`, `numero`, `capacidad`, `precio`, `comodidades`, `img_id`, `orden`) VALUES
(1, 1, 'Habitación 1 Simple', 2, 35000.00, 'Cama matrimonial, baño privado, cocina completa, balcón', 'ou4z5seirt5muexnvmqm', 0),
(2, 1, 'Habitación 2 Triple', 3, 50000.00, 'Cama matrimonial , cama individual, cocina completa, baño privado, aire acondicionado', 'qmd4or5ljpn4jlxksw0z', 0),
(3, 1, 'Habitación 3 Familiar', 4, 60000.00, 'Cama matrimonial, 2 camas individuales, cocina completa, baño privado, aire acondicionado, estufa, parrilla', 'ufj0fzwozid6skkebq18', 0),
(4, 1, 'Habitación 4 Viajero', 1, 20000.00, 'Cama individual, baño privado, cocina básica', 'pcgtqngcqlj7usxy0bro', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hospedajes`
--

CREATE TABLE `hospedajes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `horario_ingreso` varchar(50) DEFAULT NULL,
  `direccion` varchar(250) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `capacidad_max` int(11) DEFAULT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `tags` varchar(250) DEFAULT NULL,
  `mapa_url` varchar(500) DEFAULT NULL,
  `img_id` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hospedajes`
--

INSERT INTO `hospedajes` (`id`, `nombre`, `slug`, `descripcion`, `tipo`, `horario_ingreso`, `direccion`, `telefono`, `capacidad_max`, `precio_base`, `tags`, `mapa_url`, `img_id`) VALUES
(1, 'Hotel Alto Uruguay', 'hotel-alto-uruguay', 'Un hotel', 'Hotel', '10:30', '9 de Julio 833', '3772821922', 6, 40000.00, 'Baños privadas, Comedor, Pileta, Parrillas,Estacionamiento', 'https://maps.app.goo.gl/TLx5kaUS9hWxwwHi8', 'hgxt5b7ouabjwq5eblj3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items_menu`
--

CREATE TABLE `items_menu` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `img_id` varchar(250) DEFAULT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `items_menu`
--

INSERT INTO `items_menu` (`id`, `categoria_id`, `nombre`, `descripcion`, `precio`, `img_id`, `orden`) VALUES
(1, 2, 'Sandwich de Milanesa', 'Pan casero, milanesa de nalga, tomate, lechuga, queso, jamón cocido, mayonesa, kétchup, mostaza ', 12000.00, 'shuw3gce6oylpe4qmudy', 0),
(2, 4, 'Hamburguesa clásica', 'Pan casero, paty, queso, jamón, tomate, lechuga, aderezos', 6000.00, 'so4a9p5wsna1e9qsdwh4', 0),
(3, 3, 'Empanada de carne - Docena', 'Carne cortada a cuchillo, cebolla, morrón, orégano', 12000.00, 'w3ubnf5iti0nfs4hednv', 0),
(4, 5, 'Papas fritas', 'Papas fritas caseras hechas al momento', 5000.00, 'siovxbhgwwjfsihmisyq', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales`
--

CREATE TABLE `locales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `direccion` varchar(250) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `horario` varchar(150) DEFAULT NULL,
  `tags` varchar(250) DEFAULT NULL,
  `mapa_url` varchar(500) DEFAULT NULL,
  `delivery_precio` decimal(10,2) DEFAULT NULL,
  `img_id` varchar(250) DEFAULT NULL,
  `menu_pdf_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `locales`
--

INSERT INTO `locales` (`id`, `nombre`, `slug`, `descripcion`, `direccion`, `telefono`, `horario`, `tags`, `mapa_url`, `delivery_precio`, `img_id`, `menu_pdf_url`) VALUES
(5, 'Lo de Chicho', 'lo-de-chicho', 'Lugar de comida tradicional', 'Carlos Pellegrini 736 ', '3772492964', '20:30 - 00:00 hs', 'Almuerzos,Cenas,Viandas,Carnicería ', 'https://maps.app.goo.gl/TLx5kaUS9hWxwwHi8', 1000.00, 'z2fsqh8gtc1dw9qocsld', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`) VALUES
(2, 'Lucas', '81dc9bdb52d04dc20036dbd8313ed055'),
(4, 'Armando', 'c92a10324374fac681719d63979d00fe');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_menu`
--
ALTER TABLE `categorias_menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `local_id` (`local_id`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hospedaje_id` (`hospedaje_id`);

--
-- Indices de la tabla `hospedajes`
--
ALTER TABLE `hospedajes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `items_menu`
--
ALTER TABLE `items_menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `locales`
--
ALTER TABLE `locales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_menu`
--
ALTER TABLE `categorias_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `hospedajes`
--
ALTER TABLE `hospedajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `items_menu`
--
ALTER TABLE `items_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `locales`
--
ALTER TABLE `locales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categorias_menu`
--
ALTER TABLE `categorias_menu`
  ADD CONSTRAINT `categorias_menu_ibfk_1` FOREIGN KEY (`local_id`) REFERENCES `locales` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`hospedaje_id`) REFERENCES `hospedajes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `items_menu`
--
ALTER TABLE `items_menu`
  ADD CONSTRAINT `items_menu_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_menu` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
