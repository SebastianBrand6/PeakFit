CREATE DATABASE PeakFit;
USE PeakFit;

CREATE TABLE usuario(
	id_usuario INT AUTO_INCREMENT primary key,
	nombre VARCHAR(100),
    correo VARCHAR(100),
    contraseña VARCHAR(255),
    rol VARCHAR(20),
    fecha_registro DATE
    );
    
 CREATE TABLE gimnasio(
	id_gimnasio INT AUTO_INCREMENT primary key,
    nombre VARCHAR(100),
    direccion VARCHAR(100),
    ciudad VARCHAR(100),
    telefono VARCHAR(15),
    capacidad_maxima INT,
    activo INT
 );
 
 CREATE TABLE horario(
	id_horario INT AUTO_INCREMENT primary key,
    id_gimnasio INT,
    dia_semana INT,
    hora_apertura TIME,
    hora_cierre TIME,
    
    FOREIGN KEY (id_gimnasio)
    REFERENCES gimnasio(id_gimnasio)
    );
    
CREATE TABLE favorito(
	id_favorito INT AUTO_INCREMENT primary key,
    id_usuario INT,
    id_gimnasio INT,
    
    
    FOREIGN KEY (id_gimnasio)
    REFERENCES gimnasio(id_gimnasio),
    
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    );
    
    CREATE TABLE registro_ocupacion(
		id_registro INT AUTO_INCREMENT primary key,
        id_gimnasio INT,
        id_usuario INT,
        personas INT,
        fuente VARCHAR(20),
        registro DATETIME,
        
        FOREIGN KEY (id_gimnasio)
        REFERENCES gimnasio(id_gimnasio),
        
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        );

    
    
    
 
    

