function datosContenedor() {
	
  	this.tipo = "";
  	this.classe = "";
	this.enunciado ="";
	this.temps = "";
	this.calc = "";
	this.sinaleatoriedad = "";
	
	this.masinfo = new masInfo();
	this.plataforma = new plataforma();
	
 }
 
function plataforma()
{
  	this.grado = "";
  	this.titulo = "";
	this.lang ="";	

}
function masInfo()
{
  	this.inicio = "";
  	this.text = "";
}

function datosMotor() {
	
  	this.enunciado = "";
  	this.imagen = "";
  	this.ampliacion = "";
	this.elementos = new Array();
	this.orden = new orden();
	
}
 
function orden(){
	
  	this.ini = "";
  	this.fi = -1; 	
}

function elemento(){
	
  	this.contestacion = "";
  	this.orden = "";
  	this.id = -1;
}

