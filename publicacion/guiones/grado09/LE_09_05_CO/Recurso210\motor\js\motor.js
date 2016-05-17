Motor = new function()
{
	this.fons = "";
	this.pagines = new Array();
	this.palabras= new Array();
	this.lineas = new Array();
	this.currentPalabra = false;

	this.contenedor= "";
	this.input= false;

	this.INITIAL_Y = 118;

	this.datosXML = "";
	this.solucion = false;
	
	this.video ="";	
	this.currentPag = "";
	this.currentNumPag =0;
	
	/*this.input_height = 22;
	this.input_width = 175;
	this.input_x = 0;
	this.input_y = 3;
	this.fontsize = 18;*/
	
	this.ponerContenedor = function(contenedorMotor) {
	  //alert("!");
	};
	
	this.cargarDatos = function()
	{
		$.get(pppPreloader.from("data", "data/datos.xml" + "?time=" + new Date().getTime()), function (xml) {

			//debugger;
			Motor.datosXML = new datosMotor();
			
			Motor.datosXML.enunciado = $(xml).find('enunciado').text();
			Motor.datosXML.texto = $(xml).find('texto').text();
			
	       	Motor.inicializarEstructura();
			Contenedor.crearPaginacio();
			//Motor.recolocarVideo();
		});
	}
	this.inicializarEstructura = function(estado) {
		
	 	this.init();
	 	if( this.solucion )
	 	{
	 		this.solucionar();
	 		this.desactivar();	
	 	}

	};
	this.reinicializarEstructuraMotor = function()
	{
		Main.stage.removeChild(Motor.contenedor);
		Motor.inicializarEstructura();
	}
	this.estaCompletado = function(){
		//mirem si estan les creuades completades

		return true;
	};
	
	this.getEstado = function(){
		var estado = new Array();
		var realParrafos = WordBuilder.getParrafos(this.palabras);
		var palabras = new Array();
		var parrafos = new Array();
		
		for( key1 in realParrafos )
		{
			palabras = new Array();
			for( key2 in realParrafos[key1] ){
				
				if(realParrafos[key1][key2].changed ){
					palabras.push( key2 + ">>1" );
				}
			}
			if(palabras.length > 0)
				parrafos.push( key1 + ">>>" + palabras.join("||") );
		}
		return parrafos.join("|||");
	}
	
	this.revisar = function(){
		if(this.estado != "")
		{
			if( this.estado.indexOf("[") >= 0 )
			{
				var datos = this.estado.substring(1, this.estado.length-1).split("][");
				Contenedor.timeRevision = datos[0];
				var parrafos = datos[1].split("|||");
				
			}else{
				var parrafos = this.estado.split("|||");
			}
			
			var realParrafos = WordBuilder.getParrafos(this.palabras);
			
			// para cada PARRAFO
			for(key1 in parrafos)
			{
				var aPar = parrafos[key1].split(">>>");
				var idparrafo = aPar[0];
				var estado = aPar[1];
				
				for(key12 in realParrafos)
				{
		 			if(key12 == idparrafo)
		 			{
				 		var modificadas = estado.split("||");
						// miramos cada PALABRA
						for(key2 in modificadas)  // modificadas
						{
							var aMod = modificadas[key2].split(">>");
							var idpalabra = aMod[0];
							var valor = aMod[1];
							
							for( key21 in realParrafos[key12] ){ // reales
								if( idpalabra == key21 ){
									realParrafos[key12][key21].pressHandler( );
								}
							}
						}
	 				}
				}
			}
		}
	}
	
	this.validar = function() {
		var total = 0;
		var NumPalabras = 0;
	  	for(key in this.palabras)
		{
			if(this.palabras[key].toCorrect || this.palabras[key].changed)
			{
				NumPalabras++;
			}
			
			if( !this.palabras[key].toCorrect && this.palabras[key].changed)
			{
				//console.log("error");
				this.palabras[key].error();
			}
			else if(this.palabras[key].toCorrect && this.palabras[key].changed)
			{
				//console.log("correcto: "+this.palabras[key].textoCorrecto +" - "+ this.palabras[key].texto.text);
				this.palabras[key].correct();
				total++;
			}
		}
		return total.toString() +  "/" + (NumPalabras).toString();
	};

	this.hideDomObjects = function(){

	}
	this.showDomObjects = function(){

	}
	this.obtenerEstado = function(){

	  //alert("Hola, Soy" + this.primerNombre);
	};
	this.reiniciar = function() {
	  //alert("Estoy caminando!");
	};
	this.activar = function(){
		for(key in this.palabras)
		{
			this.palabras[key].activar();
		}
    	this.currentPalabra = "";
	}
	this.desactivar = function() {
		for(key in this.palabras)
		{
			this.palabras[key].desactivar();
		}
    	this.currentPalabra = "";
	};
	this.numPaginas = function(){
		return 1;
	};
	this.ponerPagina = function(pag) {
	    
	};

	this.obtenerPaginaActual = function(pag){

	};
	this.verSolucion = function(conEfecto){
	  
	  	this.deseleccionar();
	  	this.solucionar();
		//this.desactivar();	
		
	};
	this.deseleccionar = function(){

	}
	this.solucionar = function(){
		this.solucion = false;
		for(key in this.palabras)
		{

			if( this.palabras[key].toCorrect && !this.palabras[key].changed )
			{
				this.palabras[key].marcar();
				
			}else if( !this.palabras[key].toCorrect && this.palabras[key].changed  ){
				
				this.palabras[key].desmarcar();
			}

		}
	}

	this.obtenerTipoEjercicio = function() {

	};
	this.obtenerVersion = function(){

	};
	
    this.init = function()
    { 	
		this.contenedor = new createjs.Container();
		
		this.palabras = WordBuilder.getPalabrasB(Motor.datosXML.texto);
		//console.log(this.palabras);
		this.lineas = WordBuilder.getLineas(this.palabras);

		this.drawLineas();
    }
    

	this.drawLineas = function()
	{
		var space = 0;
		var line = 0;
		for(key in this.lineas)
		{
			if(this.lineas[key] == "space")
			{
				space += 12;
			}
			else
			{
				this.lineas[key].contenedor.x = 15;
				this.lineas[key].contenedor.y = (30 * line) +space;
				this.contenedor.addChild(this.lineas[key].contenedor);
				line++;
			}
		}
		
		this.contenedor.y = this.INITIAL_Y + 15;
	    Main.stage.addChild( this.contenedor );
	}
}
