


function LineaItem( index, paraules)
{
	this.contenedor = new createjs.Container();
	this.id  = index;
	
	this.xpos = 0;
	for( key2 in paraules)
	{
		//console.log(paraules[key2]);
		paraules[key2].contenedor.x = this.xpos;
		paraules[key2].contenedor.y = 0;
		this.contenedor.addChild( paraules[key2].contenedor );
		
		this.xpos += paraules[key2].texto.getMeasuredWidth()+7;
	}

}


function ParaulaItem( index, paraula)
{
	
	this.contenedor = new createjs.Container();
	//this.textoCorrecto = paraulaCorrecte;
	this.textInicial = paraula;
	this.id  = index;
	this.correcte = false;
	this.parent = null;
	this.changed = false;
	this.toCorrect = false;
	
	this.texto = new createjs.Text();
    this.texto.text = paraula;
    this.texto.font = (Contenedor.datosXML.plataforma.grado == 1)?  "18px Arial" : "16px Arial" ;
	//this.texto.fontSize = 18;
	this.texto.color = "#0D3158";

	this.contenedor.addChild( this.texto );
	
	this.marc = new createjs.Shape();
	this.marc.y = -3;
	//this.marc.graphics.beginStroke("#F8B334").setStrokeStyle(0.5).drawRoundRect(-5, -5, this.texto.getMeasuredWidth() + 10 , 25, 4);
	
	this.fons = new createjs.Shape();
	this.fons.y = -3;
	this.fons.graphics.beginFill("#fde8c2").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	//this.fons.graphics.beginFill("#fde8f2").drawRoundRect(-5, 0, this.texto.getMeasuredWidth() + 10 , 25, 4);

	this.contenedor.addChild( this.fons );
	this.contenedor.addChild( this.marc );
	this.contenedor.addChild( this.texto );

	this.contenedor.on("mousedown", this.pressHandler, this);
	this.contenedor.on("rollover", this.overHandler, this);
	this.contenedor.on("rollout", this.outHandler, this);
	this.contenedor.on("mouseover", function(evt){ document.body.style.cursor='pointer'; });
	this.contenedor.on("mouseout", function(evt){ document.body.style.cursor='default'; });
	//this.desactivar();

}

ParaulaItem.prototype.overHandler = function()
{
	if( !this.changed ) this.marc.graphics.beginStroke("#F8B334").setStrokeStyle(1).drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
}

ParaulaItem.prototype.outHandler = function()
{
	if( !this.changed ) this.marc.graphics.clear();
	//this.setTexto("Holitatatata");
}

ParaulaItem.prototype.pressHandler = function(evt){
	if(evt.primary){

		Motor.currentPalabra = this;
		
		if( !this.changed )
		{
			this.marc.graphics.clear();
			this.fons.graphics.clear();
			this.fons.graphics.beginFill("#fff").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
			this.marc.graphics.beginStroke("#F8B334").setStrokeStyle(1).drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
		}
		else{
			this.marc.graphics.clear();
			this.fons.graphics.clear();
			this.fons.graphics.beginFill("#fde8c2").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
		}
		
		this.changed = !this.changed;
	}
}
ParaulaItem.prototype.final = function(){
	for( key in Motor.audios)
	{
		if(Motor.audios[key].id == this.id[5])
		{
			Motor.audios[key].bt.bt.gotoAndStop("normal");
		}
	}
}
ParaulaItem.prototype.desactivar = function()
{
	this.contenedor.removeAllEventListeners();
}
ParaulaItem.prototype.activar = function()
{
	if( !this.contenedor.hasEventListener("mousedown") )
	{
	    this.contenedor.on("mousedown", this.pressHandler, this);
	   	this.contenedor.on("rollover", this.overHandler, this);
	    this.contenedor.on("rollout", this.outHandler, this);
	}
}
ParaulaItem.prototype.marcar = function( correcio )
{
	if( !this.correcte ){
		this.marc.graphics.clear();
		this.fons.graphics.clear();
		this.fons.graphics.beginFill("#fff").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
		this.marc.graphics.beginStroke("#F8B334").setStrokeStyle(1).drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	}
}
ParaulaItem.prototype.desmarcar = function( correcio )
{
	if( !this.correcte ){
		this.marc.graphics.clear();
		this.fons.graphics.clear();
		this.fons.graphics.beginFill("#fde8c2").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	}
}
ParaulaItem.prototype.clear = function(){
	this.marc.graphics.clear();
	this.fons.graphics.clear();
	this.fons.graphics.beginFill("#fde8c2").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
}
ParaulaItem.prototype.error = function(){
	this.marc.graphics.clear();
	this.fons.graphics.clear();
	this.fons.graphics.beginFill("#fff").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	this.marc.graphics.beginStroke("#E1001A").setStrokeStyle(2).drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	this.correcte = false;
}

ParaulaItem.prototype.correct = function(){
	this.marc.graphics.clear();
	this.fons.graphics.clear();
	this.fons.graphics.beginFill("#fff").drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	this.marc.graphics.beginStroke("#41A62A").setStrokeStyle(2).drawRoundRect(-3, 0, this.texto.getMeasuredWidth() + 6 , 25, 4);
	this.correcte = true;
}
