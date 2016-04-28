CREATE TABLE events (
	idEvent int(10) unsigned NOT NULL AUTO_INCREMENT,
	cliente char(50) NOT NULL,
	device char(50) NOT NULL,
	severity TEXT NOT NULL,
	objectclass TEXT,
	object TEXT,
	message TEXT,
	horario TEXT,
	PRIMARY KEY (idEvent)
);

CREATE TABLE actions (
	idAction int(10) unsigned NOT NULL AUTO_INCREMENT,
	idEvent int(10) NOT NULL,
	procedimiento TEXT,
	notificacion TEXT,
	llamada85 TEXT,
	llamada247 TEXT,
	asignacion TEXT,
	PRIMARY KEY (idAction)
);

