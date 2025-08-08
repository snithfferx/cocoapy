CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  role ENUM('admin', 'user') DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email),
  INDEX role_idx (role)
);

CREATE TABLE tareas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  fecha_limite DATE,
  prioridad ENUM('baja', 'media', 'alta'),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE muestra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    title VARCHAR(150),
    sectors INT,
    sensitiy INT,
    total_colonies INT,
    avg_colonies INT,
    max_colonies INT,
    min_colonies INT,
    total_per_sector VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX (usuario_id),
    INDEX (title)
);

CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expire TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

CREATE TABLE temp_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expire TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  action VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);