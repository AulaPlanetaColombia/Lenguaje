function Pagina(pregunta, _numpagina) {

	this.numpagina = _numpagina;
	this.index = -1;
	this.correccionSinMayusculas = pregunta.correccionSinMayusculas;
	this.correccionSinPuntuacion = pregunta.correccionSinPuntuacion;
	this.correccionSinPuntuacionFinal = pregunta.correccionSinPuntuacionFinal;
	//debugger;
	this.enunciat = new createjs.RichText();
	this.enunciat.text = pregunta.enunciado;

	this.inputText = new TextInputBox(this);
	this.inputText.contenedor.x = 375;
	this.inputText.contenedor.y = 85;

	this.imagen = new Imagen(pregunta, true);

	this.textIntroducido = "";

	this.enunciat.font = (Contenedor.datosXML.plataforma.grado == 1)? "19px Arial" : "17px Arial" ;
	this.enunciat.fontSize = (Contenedor.datosXML.plataforma.grado == 1)? 19 : 17 ;
	this.enunciat.color = "#0D3158";
	this.enunciat.x = 15;
	this.enunciat.y = 10;
	this.enunciat.lineWidth = 900;
	this.enunciat.lineHeight = 22;
	this.enunciat.mouseEnabled = false;

	this.explicacion = new createjs.RichText();
	this.explicacion.text = pregunta.explicacion;
	this.explicacion.font = (Contenedor.datosXML.plataforma.grado == 1)? "18px Arial" : "16px Arial" ;
	this.explicacion.fontSize = (Contenedor.datosXML.plataforma.grado == 1)? 18 : 16 ;
	this.explicacion.color = "#0D3158";
	this.explicacion.x = 380;
	this.explicacion.y = 350;
	this.explicacion.lineWidth = 475;
	this.explicacion.lineHeight = 22;
	this.explicacion.visible = false;

	this.respuesta = new createjs.RichText();
	this.respuesta.text = "";
	this.respuesta.font =(Contenedor.datosXML.plataforma.grado == 1)? "18px Arial" : "16px Arial" ;
	this.respuesta.fontSize = (Contenedor.datosXML.plataforma.grado == 1)? 18 : 16 ;
	this.respuesta.color = "#0D3158";
	this.respuesta.x = 380;
	this.respuesta.y = 155;
	this.respuesta.lineWidth = 475;
	this.respuesta.lineHeight = 22;
	this.respuesta.visible = false;

	this.unidades = new createjs.RichText();
	this.unidades.text = pregunta.unidades;
	this.unidades.font = (Contenedor.datosXML.plataforma.grado == 1)? "18px Arial" : "16px Arial" ;
	this.unidades.fontSize = (Contenedor.datosXML.plataforma.grado == 1)? 18 : 16 ;
	this.unidades.color = "#0D3158";
	this.unidades.x = 785;
	this.unidades.y = 120;
	this.unidades.lineWidth = 200;
	this.unidades.lineHeight = 22;

	this.validacio = true;
	this.respostes = new Array();

	this.contenedor = new createjs.Container();
	this.contenedor.addChild(this.enunciat);
	this.contenedor.addChild(this.inputText.contenedor);
	this.contenedor.addChild(this.imagen.contenedor);
	this.contenedor.addChild(this.explicacion);
	this.contenedor.addChild(this.unidades);
	this.contenedor.addChild(this.respuesta);

	var num_respuestas = pregunta.respuestas.length;
	for (var i = 0; i < num_respuestas; i++) {
		var resp = pregunta.respuestas[i];
		this.respostes.push(resp);
		if (i == 0 || resp.mostrar == "1")
			this.respuesta.text = resp.text;
	}
}

Pagina.prototype.explicar = function(){
	this.explicacion.visible = true;
}
Pagina.prototype.saveText = function(){
	
	this.textIntroducido = $(Motor.inputDOM.htmlElement).val();
}
Pagina.prototype.drawText = function(){
	
    var navegadorSplit = Main.navegador.split(' ');
    var mobil = Main.mobil
    var index = navegadorSplit[0].indexOf("Safari");

    if(index > -1 && mobil =="Android"){
    	$(Motor.inputDOM.htmlElement).focus().blur();
    }
	$(Motor.inputDOM.htmlElement).val(this.textIntroducido);
}
function TextInputBox( pagina) {
	this.correcte = false;
	this.checked = false;
	this.paginaPare = pagina;
	this.contenedor = new createjs.Container();

	//debugger;
	this.contesta = new createjs.RichText();
	this.contesta.text = LangRes.lang[ LangRes.ESCRIBE ];
	this.contesta.font = (Contenedor.datosXML.plataforma.grado == 1)? "18px Arial" : "16px Arial" ;
	this.contesta.fontSize = (Contenedor.datosXML.plataforma.grado == 1)? 18 : 16 ;
	this.contesta.color = "#0D3158";
	this.contesta.x = 2;
	this.contesta.y = 2;
	this.contesta.lineWidth = 500;
	this.contesta.lineHeight = 22;
	this.contesta.mouseEnabled = false;

	this.fonsInput = new createjs.Shape();
	this.fonsInput.graphics.beginFill("#fff").drawRoundRect(0, 0, 400, 32, 5);

	this.marcInput = new createjs.Shape();
	this.marcInput.graphics.beginStroke("#F8B334").setStrokeStyle(1).drawRoundRect(0, 0, 400, 32, 5);

	this.areaText = new createjs.Container();
	this.areaText.x = 0;
	this.areaText.y = 30;

	this.areaText.addChild(this.fonsInput);
	this.areaText.addChild(this.marcInput);

	this.contenedor.addChild(this.areaText);
	this.contenedor.addChild(this.contesta);
}

TextInputBox.prototype.solucion = function() {
	if( !this.correcte ){
		this.paginaPare.respuesta.visible = true;
	}
	this.paginaPare.explicacion.visible = true;
}
TextInputBox.prototype.removeError = function(){

	if(!this.correcte) this.clear();
}
TextInputBox.prototype.clear = function() {
	this.marcInput.graphics.clear();
	this.marcInput.graphics.beginStroke("#F8B334").setStrokeStyle(1).drawRoundRect(0, 0, 400, 32, 5);
}
TextInputBox.prototype.error = function() {
	this.marcInput.graphics.clear();
	this.marcInput.graphics.beginStroke("#E1001A").setStrokeStyle(3).drawRoundRect(0, 0, 400, 32, 5);
	this.correcte = false;
}

TextInputBox.prototype.correct = function() {
	this.marcInput.graphics.clear();
	this.marcInput.graphics.beginStroke("#41A62A").setStrokeStyle(3).drawRoundRect(0, 0, 400, 32, 5);
	this.correcte = true;
}
function Imagen(pregunta, gran) {
	// get imagen
	this.contenedor = new createjs.Container();

	var img = new Image();
	var objeto = this;
	img.onload = function() {
		objeto.imagen = new createjs.Bitmap(this);

		if (gran) {
			objeto.imagen.x = 25;
			objeto.imagen.y = 75;
			//escalem imatges
			objeto.imagen.scaleX = 300 / this.width;
			objeto.imagen.scaleY = 300 / this.height;

			//mascara de cantonades arrodonides
			objeto.imagen.mask = new createjs.Shape();
			objeto.imagen.mask.graphics.beginFill("#fff").drawRoundRect(0, 0, 300, 300, 10);
			objeto.imagen.mask.x = 25;
			objeto.imagen.mask.y = 75;
		} else {
			objeto.imagen.x = 55;
			objeto.imagen.y = -40;
			//escalem imatges
			objeto.imagen.scaleX = 110 / this.width;
			objeto.imagen.scaleY = 110 / this.width;

			//mascara de cantonades arrodonides
			objeto.imagen.mask = new createjs.Shape();
			objeto.imagen.mask.graphics.beginFill("#fff").drawRoundRect(0, 0, 110, 110, 10);
			objeto.imagen.mask.x = 55;
			objeto.imagen.mask.y = -40;
		}

		objeto.contenedor.addChild(objeto.imagen);
		
		// boton de ampliacion
		if (pregunta.ampliacion != "") {
			objeto.contenedor.addChild(objeto.zoom);
			objeto.imagen.on("click", objeto.zooming, objeto);
			objeto.imagen.on("mouseover", function(evt){ document.body.style.cursor='pointer'; });
			objeto.imagen.on("mouseout", function(evt){ document.body.style.cursor='default'; });
		}
	};

	if (pregunta.imagen != "")
		img.src = pppPreloader.from("data", Motor.IMG + pregunta.imagen);//Motor.IMG + pregunta.imagen;

	// imagen ampliada
	if (pregunta.ampliacion != "" && pregunta.ampliacion != undefined) {
		this.ampliacion = new Ampliacion(pregunta);
		this.ampliacion.contenedor.x = 0;
		this.ampliacion.contenedor.y = 0;
		this.ampliacion.contenedor.alpha = 0;
		Main.stage.addChild(this.ampliacion.contenedor);

		this.zoom = new createjs.Bitmap(pppPreloader.from("module", 'motor/images/ico_zoom.png'));
		if (gran) {
			this.zoom.x = 285;
			this.zoom.y = 335;
		} else {
			this.zoom.x = 135;
			this.zoom.y = 40;
			this.zoom.scaleX = 0.75;
			this.zoom.scaleY = 0.75;
		}
		this.zoom.on("mouseover", function(evt){ document.body.style.cursor='pointer'; });
		this.zoom.on("mouseout", function(evt){ document.body.style.cursor='default'; });
		this.zoom.on("click", this.zooming, this);
	}
}

Imagen.prototype.zooming = function(evt){
	if( evt.primary ){
		Main.stage.setChildIndex(this.ampliacion.contenedor, Main.stage.getNumChildren() - 1);
		this.ampliacion.contenedor.visible = true;
		
		$(Motor.inputDOM.htmlElement).blur();
		
		Motor.hideDomObjects();
		createjs.Tween.get(this.ampliacion.contenedor).to({
			alpha : 1
		}, 500, createjs.Ease.circOut);
	}
}
function Ampliacion(pregunta) {
	this.fons = new createjs.Shape();
	this.fons.graphics.beginFill("#fff").drawRoundRect(0, 0, Main.stage_width, Main.stage_height, 5);
	this.fons.alpha = 0.60;

	this.contenedor = new createjs.Container();
	this.contenedor.addChild(this.fons);

	var img = new Image();
	var amplia = this;

	this.imagen = "";
	img.onload = function() {

		amplia.imagen = new createjs.Bitmap(this);

		amplia.imagen.scaleX = 500 / this.height;
		amplia.imagen.scaleY = 500 / this.height;

		amplia.imagen.x = (Main.stage_width - (this.width * 500 / this.height)) / 2;
		amplia.imagen.y = 50;

		//mascara de cantonades arrodonides
		amplia.imagen.mask = new createjs.Shape();
		amplia.imagen.mask.graphics.beginFill("#fff").drawRoundRect(0, 0, 500, this.height * 500 / this.width, 10);
		amplia.imagen.mask.x = (Main.stage_width - (this.width * 500 / this.height)) / 2;
		amplia.imagen.mask.y = 50;

		amplia.contenedor.addChild(amplia.imagen);
	};
	img.src = pppPreloader.from("data", Motor.IMG + pregunta.ampliacion);//Motor.IMG + pregunta.ampliacion;

	this.contenedor.on("click", this.tancar);
	this.contenedor.on("mouseover", function(evt){ document.body.style.cursor='pointer'; });
	this.contenedor.on("mouseout", function(evt){ document.body.style.cursor='default'; });
}

Ampliacion.prototype.tancar = function(evt){
	if( evt.primary ){
		
		createjs.Tween.get(this).to({
			alpha : 0
		}, 500, createjs.Ease.circOut);
		Motor.showDomObjects();
	}
}
