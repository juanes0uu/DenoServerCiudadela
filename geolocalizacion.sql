CREATE DATABASE geolocalizacion;
USE geolocalizacion;
drop database geolocalizacion;
CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Documento VARCHAR(255) NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Lugar (
    IdLugar INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Latitud DECIMAL(10,8) NOT NULL,
    Longitud DECIMAL(11,8) NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Ubicacion (
    IdUbicacion INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT NOT NULL,
    Latitud DECIMAL(10,8) NOT NULL,
    Longitud DECIMAL(11,8) NOT NULL,
    FechaHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Ruta (
    IdRuta INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT NOT NULL,
    Nombre VARCHAR(150),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE RutaDetalle (
    IdRutaDetalle INT AUTO_INCREMENT PRIMARY KEY,
    IdRuta INT NOT NULL,
    Latitud DECIMAL(10,8) NOT NULL,
    Longitud DECIMAL(11,8) NOT NULL,
    Orden INT NOT NULL, -- para saber en qué secuencia va
    FOREIGN KEY (IdRuta) REFERENCES Ruta(IdRuta)
);