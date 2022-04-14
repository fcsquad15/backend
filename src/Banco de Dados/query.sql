CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  avatar TEXT,
  bio VARCHAR(255),
  area VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS habilidades (
	id SERIAL PRIMARY KEY,
  	habilidade VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS  habilidadeUsuarios (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  habilidade_id INT REFERENCES habilidades(id)
);

CREATE TABLE IF NOT EXISTS  horarios (
  id SERIAL PRIMARY KEY,
  hora TIME
);

CREATE TABLE IF NOT EXISTS  agenda (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  habilidade_id INT REFERENCES habilidades(id),
  dia DATE NOT NULL,
  hora_id INT NOT NULL REFERENCES horarios(id),
  disponivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS  mentorias (
  id SERIAL PRIMARY KEY,
  usuario_mentorado_id INT REFERENCES usuarios(id),
  agenda_id INT REFERENCES agenda(id)  
);

CREATE TABLE IF NOT EXISTS  postagem (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  pergunta  TEXT NOT NULL,
  habilidade_id INT REFERENCES habilidades(id),
  hora_postagem TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS  comentarios (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  comentario  TEXT NOT NULL,
  postagem_id INT REFERENCES postagem(id),
  hora_postagem TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS area (
	id SERIAL PRIMARY KEY,
  	area VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS  areaUsuarios (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  area_id INT REFERENCES area(id)
);


CREATE TABLE IF NOT EXISTS  notificacao (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  data_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
