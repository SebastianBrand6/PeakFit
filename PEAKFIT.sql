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


    -- DATOS 

INSERT INTO usuario VALUES
(1,'Admin','admin@gym.com','hash_de_prueba','admin','2026-10-01'),
(2,'Carlos Pérez','carlos@correo.com','hash_de_prueba','usuario','2026-10-02'),
(3,'Ana López','ana@correo.com','hash_de_prueba','usuario','2026-10-03'),
(4,'Luis Martínez','luis@correo.com','hash_de_prueba','usuario','2026-10-04'),
(5,'María Gómez','maria@correo.com','hash_de_prueba','usuario','2026-10-05'),
(6,'Pedro Sánchez','pedro@correo.com','hash_de_prueba','usuario','2026-10-06');
 
INSERT INTO gimnasio VALUES
(1,'PowerFit Poblado','Cra 43A #10-20','Medellín','3001112233',80,1),
(2,'IronHouse Laureles','Cir 4 #70-15','Medellín','3004445566',60,1),
(3,'FitZone Envigado','Calle 37 Sur #30-10','Envigado','3107778899',100,1),
(4,'Muscle Center Belén','Cra 76 #30-50','Medellín','3205556677',50,1);
 
INSERT INTO horario VALUES
(1,1,1,'05:00:00','22:00:00'),
(2,1,2,'05:00:00','22:00:00'),
(3,1,3,'05:00:00','22:00:00'),
(4,1,4,'05:00:00','22:00:00'),
(5,1,5,'05:00:00','22:00:00'),
(6,1,6,'07:00:00','18:00:00'),
(7,2,1,'06:00:00','21:00:00'),
(8,2,2,'06:00:00','21:00:00'),
(9,2,3,'06:00:00','21:00:00'),
(10,2,4,'06:00:00','21:00:00'),
(11,2,5,'06:00:00','21:00:00'),
(12,2,6,'08:00:00','16:00:00'),
(13,3,1,'05:00:00','23:00:00'),
(14,3,2,'05:00:00','23:00:00'),
(15,3,3,'05:00:00','23:00:00'),
(16,3,4,'05:00:00','23:00:00'),
(17,3,5,'05:00:00','23:00:00'),
(18,3,6,'06:00:00','20:00:00'),
(19,4,1,'06:00:00','20:00:00'),
(20,4,2,'06:00:00','20:00:00'),
(21,4,3,'06:00:00','20:00:00'),
(22,4,4,'06:00:00','20:00:00'),
(23,4,5,'06:00:00','20:00:00'),
(24,4,6,'08:00:00','14:00:00');
 
INSERT INTO favorito VALUES
(1,2,1),
(2,2,3),
(3,3,1),
(4,4,2),
(5,5,4),
(6,6,3);
 
-- id_usuario en NULL = lo registró un sensor
INSERT INTO registro_ocupacion VALUES
(1,1,NULL,12,'admin','2026-10-12 06:00:00'),
(2,1,NULL,25,'admin','2026-10-12 12:00:00'),
(3,1,NULL,70,'admin','2026-10-12 18:00:00'),
(4,2,NULL,8,'admin','2026-10-12 06:00:00'),
(5,2,NULL,20,'admin','2026-10-12 12:00:00'),
(6,2,NULL,52,'admin','2026-10-12 18:00:00'),
(7,3,NULL,20,'admin','2026-10-12 06:00:00'),
(8,3,NULL,40,'admin','2026-10-12 12:00:00'),
(9,3,NULL,92,'admin','2026-10-12 18:00:00'),
(10,4,NULL,5,'admin','2026-10-12 06:00:00'),
(11,4,NULL,15,'admin','2026-10-12 12:00:00'),
(12,4,NULL,41,'admin','2026-10-12 18:00:00'),
(13,1,NULL,15,'admin','2026-10-13 06:00:00'),
(14,1,NULL,28,'admin','2026-10-13 12:00:00'),
(15,1,NULL,74,'admin','2026-10-13 18:00:00'),
(16,2,NULL,10,'admin','2026-10-13 06:00:00'),
(17,2,NULL,22,'admin','2026-10-13 12:00:00'),
(18,2,NULL,49,'admin','2026-10-13 18:00:00'),
(19,3,NULL,25,'admin','2026-10-13 06:00:00'),
(20,3,NULL,38,'admin','2026-10-13 12:00:00'),
(21,3,NULL,88,'admin','2026-10-13 18:00:00'),
(22,4,NULL,6,'admin','2026-10-13 06:00:00'),
(23,4,NULL,12,'admin','2026-10-13 12:00:00'),
(24,4,NULL,44,'admin','2026-10-13 18:00:00'),
(25,1,2,15,'usuario',NOW()),
(26,2,3,55,'usuario',NOW()),
(27,3,NULL,30,'sensor',NOW()),
(28,4,NULL,47,'sensor',NOW());

    
    
 
    

