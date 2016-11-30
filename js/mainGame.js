alert("kjahs");
//Objetos importantes de canvas
//Variable canvas la cual contiene el id, que se esta referenciando en el HTML
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
//Variable que almacena las coordenadas y tamaño del objeto de la nave
var nave = {
	x:100,
	y:canvas.height-100, 
	width:40,
	height:70,
	contador: 0,
	puntaje:0
}
//Objetos json que indica el estado en el que se encuentra el juego
var juego = {
	estado: 'iniciando'
};
//Objeto para escribir el mensaje de victoria o derrota del jugador
var textoRespuesta = {
	contador: -1,
	titulo: "",
	subtitulo: ""
}
var keyboard = {};
//Array para los disparos
var disparos = [];
var disparosEnemigo = [];
//Array que se encarga de almacenar los enemigos
var enemigos = [];

//Definir variables para las imagenes
var fondo;
//Deficion de funciones
function loadMedia() {
	fondo = new Image();
	fondo.src = 'imagenes/universo.jpg';
	fondo.onload = function() {
		var intervalo = window.setInterval(frameLoop, 1000/60);
	}
}
//Funcion que sirve para dibujar y poder poner el fondo de la pantalla
function dibujarFondo() {
	ctx.drawImage(fondo,0,0);
}
//Funcion que se encarga de cargar la imagen de la nave en el canvas
function dibujarNave() {
	var imgNave = document.getElementById("imagenNave");
	ctx.save();
	ctx.drawImage(imgNave, nave.x, nave.y, nave.width, nave.height);
	ctx.restore();
	/*var imgNave = new Image();
	imgNave.src = "imagenes/nave.png";
	imgNave.onload = function() {
		ctx.save();
	ctx.drawImage(imgNave, nave.x, nave.y, nave.width, nave.height);
		//ctx.drawImage = 'white';
		//ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
		ctx.restore();
	}*/
}
//funcion para dibujar enemigos
function dibujarEnemigos() {
	var imgNavesEnemigas = document.getElementById("navesEnemigas");
	for(var i in enemigos) {
		var enemigo = enemigos[i];
		ctx.save();
		ctx.drawImage(imgNavesEnemigas, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
	}
}
//Funcion que sirve para que el teclado se active en cualquier navegador web
function addEventKeyboard() {
	addEventBrowser(document,"keydown", function(e) {
		//Ponemos en true la tecla que presionamos
		keyboard[e.keyCode] = true;
	});
	addEventBrowser(document,"keyup", function(e) {
		//Ponemos en false la tecla que dejo de ser presionada
		keyboard[e.keyCode] = false;
	});
	function addEventBrowser(element,eventName,func) {
		if(element.addEventListener) {
			//Evento para los demas Navegadores
			element.addEventListener(eventName,func,false); 
		} else if(element.attachEvent) {
			//Evento solo para navegador Explorer
			element.attachEvent(eventName,func);
		}
	}
}
//Funcion que activa el movimiento de la nave por medio de las teclas del teclado
function moverNave() {
	//Codigo de la tecla izquierda
	if(keyboard[37]) {
		//Movimiento a la izquierda
		nave.x -= 4;
		if(nave.x < 0) nave.x = 0;
	}
	//Codigo de la tecla derecha
	if(keyboard[39]) {
		//Movimiento a la derecha
		var limite = canvas.width - nave.width;
		nave.x += 4;
		if(nave.x > limite) nave.x = limite;
	}
	if(keyboard[32]) {
		//Variable booleana para los disparos
		if(!keyboard.fire) {
			fire();
			keyboard.fire = true;
		}	
	} else keyboard.fire = false;
	//Muestra el estado game over en el juego
	if(nave.estado == 'hit') {
		nave.contador++;
		if(nave.contador >= 20) {
			nave.contador = 0;
			nave.estado = 'muerto';
			juego.estado = 'perdido'
			textoRespuesta.titulo = 'Game Over';
			textoRespuesta.subtitulo = 'Presiona la tecla R, para reiniciar la partida';
			textoRespuesta.contador = 0;
		}
	}
}
//Disparos de los enemigos
function dibujarDisparosEnemigos() {
	var imgDisparosEnemigos = document.getElementById("imgDisparosEnemigo");
	for(var i in disparosEnemigo) {
		var disparo = disparosEnemigo[i];
		ctx.save();
		ctx.drawImage(imgDisparosEnemigos, disparo.x, disparo.y, disparo.width, disparo.height);
		ctx.restore();
	}
}
//Moviendo los disparos de los enemigos 
function moverDisparosEenemigo() {
	for(var i in disparosEnemigo) {
		var disparo = disparosEnemigo[i];
		disparo.y += 3;
	}
	disparosEnemigo = disparosEnemigo.filter(function(disparo) {
		return disparo.y < canvas.height;
	}); 
}
function actualizarEnemigos() {
	function agregarDisparosEnemigos() {
		return {
			x:enemigo.x,
			y:enemigo.y,
			width:35,
			height:35,
			contador:0
		}
	}
	//Si el juego esta iniciado este crea 10 enemigos
	if(juego.estado == 'iniciando') {
		for(var i = 0; i < 12; i++) {
			enemigos.push({
				//Posicionamiento de enemigos para modificar la posicion en x:10 + (i * 50),
				x: 0 + (i*50),
				y: 25, 
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		/*for(var i = 0; i < 10; i++) {
			enemigos.push({
				//Posicionamiento de enemigos para modificar la posicion en x:10 + (i * 50),
				x: 50 + (i*50),
				y: 50, 
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}*/
		juego.estado = 'jugando';
	}
	for(var i in enemigos) {
		var enemigo = enemigos[i];
		if(!enemigo) continue;
		if(enemigo && enemigo.estado == 'vivo') {
			enemigo.contador ++;
			/*Aca lo que hacemos es darle las coordenadas en las que se moveran 
			los enemigos en el ancho de la pantalla*/
			enemigo.x += Math.sin(enemigo.contador * Math.PI / 145)*5;
			//Disparos aleatorios de los enemigos 
			if(aleatorio(0, enemigos.length * 30) == 4) {
				disparosEnemigo.push(agregarDisparosEnemigos(enemigo));
			}
		}
		//Validacion de estado del enemigo
		if(enemigo && enemigo.estado == 'hit') {
			enemigo.contador ++;
			if(enemigo.contador >= 20) {
				enemigo.estado = 'muerto';
				enemigo.contador = 0;
				nave.puntaje += 10;
				console.log(nave.puntaje);
			}
		}
	}
	//Validacion quitar el enemigo muerto
	enemigos = enemigos.filter(function(enemigo) {
		if(enemigo && enemigo.estado != 'muerto') return true;
		return false;
	});
}
function moverDisparos() {
	for(var i in disparos) {
		var disparo = disparos[i];
		disparo.y -= 2;
	}
	disparos = disparos.filter(function(disparo) {
		return disparo.y > 0;
	});
}
function fire() {
	disparos.push({
		x: nave.x + 20,
		y: nave.y - 20,
		width: 20,
		height: 30
	});
}
function dibujarDisparos() {
	var imgDisparoNave = document.getElementById("disparosNave");
	ctx.save();
	for(var i in disparos) {
	 	var disparo = disparos[i];
	 	ctx.drawImage(imgDisparoNave, disparo.x, disparo.y, disparo.width, disparo.height);
	}
	ctx.restore();
}
function dibujarTexto() {
	if(textoRespuesta.contador == -1) return;
	var alpha = textoRespuesta.contador / 50.0;
	if(alpha > 1) {
		for(var i in enemigos) {
			delete enemigos[i];
		}
	}
	ctx.save();
	ctx.globalAlpha = alpha;
	if(juego.estado == 'perdido') {
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo, 350,240);
		ctx.font = '14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo, 315,268);
	}
	if(juego.estado == 'Ganaste') {
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 35pt Arial';
		ctx.fillText(textoRespuesta.titulo, 60,240);
		ctx.font = '14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo, 315,268);
	}
}
//Funcion que se encarga de dibujar el texto del puntaje del juego
function dibujarPuntajes() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Puntos: " + nave.puntaje, 15, 28);
    //ctx.fillText("Vidas Restantes: " + vidas, canvas.width -185, 30);
}
//funcion que no servira para devolver solo numeros enteros de las puntuaciones
/*function random(max) {
	return Math.floor(Math.random() * max);
}*/
function actualizarEstadoJuego() {
	if(juego.estado == 'jugando' && enemigos.length == 0) {
		juego.estado = 'Ganaste';
		textoRespuesta.titulo = 'Felicidades has matado a tus enemigos';
		textoRespuesta.subtitulo = 'Presiona la tecla R, para reiniciar la partida';
		textoRespuesta.contador = 0;		
	}
	if(textoRespuesta.contador >= 0) {
		textoRespuesta.contador++;
	}
	/*Condicion que sirve para validar cuando pierdes y poder reiniciar el juego a la
	hora de presionar la tecla R*/
	if((juego.estado == 'perdido' || juego.estado == 'Ganaste') && keyboard[82]) {
		juego.estado = 'iniciando';
		nave.estado = 'vivo';
		textoRespuesta.contador = -1;
	}
}
//Algoritmo de validacion de colisiones con los objetos 
function hit(a,b) {
	var hit = false;
	//Colisiones Horizontales
	if(b.x + b.width >= a.x && b.x < a.x + a.width) {
		//Colisiones Verticales
		if(b.y + b.height >= a.y && b.y < a.y + a.height) {
			hit = true;
		}
	}
	//Colisiones de a con b
	if(b.x <= a.x && b.x + b.width >= a.x + a.width) {
		if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
			hit = true;
		}
	}
	//Colisiones de b con a
	if(a.x <= b.x && a.x + a.width >= b.x + b.width) {
		if(a.y <= b.y && a.y + a.height >= b.y + b.height) {
			hit = true;
		}
	}
	return hit;
}
//Funcion que valida el contacto que hacen los disparos con los enemigos
function verificarContacto() {
	for(var i in disparos) {
		var disparo = disparos[i];
		for(j in enemigos) {
			var enemigo = enemigos[j];
			if(hit(disparo,enemigo)) {
				enemigo.estado = 'hit';
				enemigo.contador = 0;
			}
		}
	}
	if(nave.estado == 'hit' || nave.estado == 'muerto') return;
	for(var i in disparosEnemigo) {
		var disparo = disparosEnemigo[i];
		if(hit(disparo,nave)) {
			nave.estado = 'hit';
		}
	}	
}
function aleatorio(inferior,superior) {
	var posibilidades = superior - inferior;
	var numAleatorio = Math.random() * posibilidades;
	numAleatorio = Math.floor(numAleatorio);
	return parseInt(inferior) + numAleatorio;
}
function frameLoop() {
	dibujarFondo();
	dibujarNave();
	moverNave();
	dibujarDisparos();
	moverDisparos();
	dibujarEnemigos();
	dibujarDisparosEnemigos();
	moverDisparosEenemigo();
	verificarContacto();
	actualizarEnemigos();
	actualizarEstadoJuego();
	dibujarTexto();
	dibujarPuntajes()
}
//Ejecucion de funciones
loadMedia();
addEventKeyboard();
