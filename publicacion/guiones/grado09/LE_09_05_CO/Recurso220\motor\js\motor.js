Motor = new function()
{
	this.fons = "";
	this.pagines = new Array();

	
	this.contenedor = "";

	this.INITIAL_Y = 118;
	this.PREG_Y_PADDING = 87;
	this.PREG_X_PADDING = 25;
	
	//inici
	this.PREG_INICI_X_PADDING = 235 ;
	//final
	this.PREG_FINAL_X_PADDING = 585 ;
	
	this.RESP_HEIGHT = 82;
	this.RESP_WIDTH = 322; 
	this.RESP_INNER_HEIGHT = 78;
	this.RESP_INNER_WIDTH = 320; 
	
	//line
	this.LINE_X = 570;
	this.LINE_Y_MIN = 20;
	this.LINE_Y_MAX = 535;
	this.LINE_SIZE = 3;
	
	this.itemX= 0;
	this.itemY= 0;
	
	this.separator = ""; 
	
	this.datosXML = "";
	this.solucion = false;
	
	this.video ="";	
	this.currentPag = "";
	this.currentNumPag =0;
	
	this.inputText ="";
	 
	this.IMG = "data/imagenes/";
	
	this.ponerContenedor = function(contenedorMotor) {
	  //alert("Estoy caminando!");
	};
	
	this.cargarDatos = function()
	{
		//console.log("carga datos");
		$.get(pppPreloader.from("data", "data/datos.xml" + "?time=" + new Date().getTime()), function (xml) {

			//debugger;
			Motor.datosXML = new datosMotor();
			Motor.datosXML.cantidad = $(xml).find('test').attr('cantidad');
			
			$(xml).find('cuestion').each(function(index) {
				//debugger;
				this.preg = new pregunta();
				this.preg.explicacion = $(this).children('explicacion').text();
				this.preg.id = index;
				this.preg.enunciado = $(this).children('enunciado').text();
				this.preg.imagen = $(this).children('imagen').text();
				this.preg.ampliacion = $(this).children('ampliacion').text();
				
				this.preg.correccionSinMayusculas = $(this).attr('correccionSinMayusculas');
				this.preg.correccionSinPuntuacionFinal = $(this).attr('correccionSinPuntuacionFinal');
				this.preg.correccionSinPuntuacion = $(this).attr('correccionSinPuntuacion');
				this.preg.unidades = $(this).children('unidades').text();
				
				var dato = this;
				//debugger;
				$(this).find('respuesta').each(function(index2) {
					//debugger;
					var rest = new respuesta();
					rest.text = $(this).attr('contestacion');
					rest.mostrar = $(this).attr('mostrar');
					rest.id = index2;
					
				  	dato.preg.respuestas.push(rest);
				});

			  	Motor.datosXML.preguntas.push(this.preg);

			});
			//console.log(Motor.datosXML);
	       	Motor.inicializarEstructura();
			Contenedor.crearPaginacio();
		});
	}
	this.inicializarEstructura = function(estado) {
		
	 	this.init();

	};
	this.reinicializarEstructuraMotor = function()
	{
		Main.stage.removeChild(Motor.contenedor);
		Motor.deleteInputs();
		Motor.cargarDatos();
		
	}
	this.estaCompletado = function(){
	  	var total = 0;
	  	for(key1 in Motor.pagines){
	  		var contestada = false
	   		for (key2 in Motor.pagines[key1].respostes) 
	   		{
	   			if(Motor.pagines[key1].respostes[key2].checked )
	   			{
	   				contestada = true;
	   			}
			}
			if( !contestada ) return false;
		}
		return true;
	};
	
	this.getEstado = function(){
		var estado = new Array();
		for( var i = 0 ; i < Motor.pagines.length ; i++ ){
			for( var key1 in Motor.pagines ){
				if( i == Motor.pagines[key1].index ){
			   		estado.push( Motor.pagines[key1].textIntroducido );
			   	}
		   	}
	  	 }
		
		return estado.join("|");
	}
	
	this.revisar = function(){
		if(this.estado != "")
		{
			if( this.estado.indexOf("[") >= 0 )
			{
				var datos = this.estado.substring(1, this.estado.length-1).split("][");
				Contenedor.timeRevision = datos[0];
				var estado = datos[1].split("|");
			}else{
				var estado = this.estado.split("|");
			}
			
			for(var key in estado)
			{
				if(estado[key].trim() != ""){
					//var repuestas = estado[key].split(",");
					for(var key1 in Motor.pagines)
					{
						if( key == Motor.pagines[key1].index )
						{
					   		 Motor.pagines[key1].textIntroducido = estado[key] ;
						}
					}
				}
			}
			
			this.currentPag.drawText();
		}
	}
	
	this.validar = function() {
		var total = 0;
		this.currentPag.saveText();
		
	  	for(key1 in Motor.pagines){
	  		var trobat = false;
	   		for(key2 in Motor.pagines[key1].respostes){
				var respuestaCorrecta = Motor.pagines[key1].respostes[key2].text;
				var respuestaReal = Motor.pagines[key1].textIntroducido;

				if( Motor.compareResults( Motor.pagines[key1], respuestaCorrecta, respuestaReal ))
				{
					trobat = true;
					total++;
					Motor.pagines[key1].inputText.correct();
				}
			}
			if(!trobat)
			{
				Motor.pagines[key1].validacio = false;
				if( Motor.pagines[key1].textIntroducido.trim() != "" ) Motor.pagines[key1].inputText.error();	
			}
		}
		return total.toString() +  "/" + Motor.pagines.length.toString();
	};
	this.compareResults = function(pregunta, textoCorrecto, textoIntroducido ){
		
		var modo ="";
		
		if (pregunta.correccionSinMayusculas == 1)
				modo |= CorrectorTexto.MODO_CI;
		if (pregunta.correccionSinPuntuacion == 1)
				modo |= CorrectorTexto.MODO_NOPUNCT;
		if (pregunta.correccionSinPuntuacionFinal == 1)
				modo |= CorrectorTexto.MODO_NOENDPUNCT;
		
		return CorrectorTexto.esValido(textoIntroducido, textoCorrecto, modo);

	};
	this.hideDomObjects = function(){
		this.inputDOM.visible = false;
		$(this.inputDOM.htmlElement).css("color", "transparent");
	}
	this.showDomObjects = function(){
		this.inputDOM.visible = true;
		$(this.inputDOM.htmlElement).css("color", "#0D3158");
		 
	}
	this.obtenerEstado = function(){

	  //alert("Hola, Soy" + this.primerNombre);
	};
	this.reiniciar = function() {
	  //alert("Estoy caminando!");
	};
	this.activar = function(){
		$(this.inputDOM.htmlElement).prop("readonly",false);
	}
	this.desactivar = function(){
		$(this.inputDOM.htmlElement).prop("readonly",true);
	}
	this.numPaginas = function(){
		return Motor.datosXML.cantidad;
	};
	this.ponerPagina = function(pag) {
		this.currentPag.saveText();
		
		this.contenedor.removeChild( this.currentPag.contenedor );
		this.currentNumPag = pag - 1;
	    this.currentPag = this.pagines[this.currentNumPag];
	    this.contenedor.addChild( this.currentPag.contenedor );
	    
	    this.currentPag.drawText();
	};

	this.obtenerPaginaActual = function(pag){

	};
	this.verSolucion = function(conEfecto){
	  
	  	//this.deseleccionar();
	  	this.solucionar();
		this.desactivar();	
		
	};
	
	this.solucionar = function(){
		var total = 0;
		this.solucion = false;
		
	  	for(key1 in Motor.pagines){
			Motor.pagines[key1].inputText.removeError();
			Motor.pagines[key1].inputText.solucion();
		}
	}
	this.obtenerTipoEjercicio = function() {

	};
	this.obtenerVersion = function(){

	};
	
    this.init = function()
    {
		this.contenedor = new createjs.Container();
		this.pagines= new Array();
		
		this.createInput()
		
	    for(var i=0; i < Motor.datosXML.cantidad; i++)
    	{
	    	var index = 0;
			if(Contenedor.datosXML.sinaleatoriedad == 0 && Scorm.modo != Scorm.MODO_REVISAR && Scorm.modo != Scorm.MODO_REVISARALUMNO )
			{
				index = Math.floor( Math.random()*Motor.datosXML.preguntas.length);
			} 
			
			var pregunta = Motor.datosXML.preguntas[index];
			Motor.datosXML.preguntas.splice(index,1);
		
	    	this.addPagina( pregunta, i );
	    }
	    this.contenedor.addChild( this.pagines[0].contenedor );
	    this.currentPag = this.pagines[0] ;
	    this.currentNumPag = 0;
	    
	    Main.stage.addChild( this.contenedor );
    }
    
    this.addPagina = function( pregunta, numpagina )
    {
    	
    	var pagina = new Pagina( pregunta, numpagina );
    	pagina.index = pregunta.id;
    	pagina.contenedor.y = this.INITIAL_Y;
    	this.pagines.push( pagina );
    	
    }
    this.createInput = function()
    {
		var $input = $('<input type="text" id="input0" class="input" onkeydown="Motor.keyPress();"/>');
		
		$("#mediaHolder").append($input);

		this.inputDOM = new createjs.DOMElementCustom($input.attr("id"), this.contenedor);
		
		this.inputDOM.element_x = 380;
		this.inputDOM.element_y = this.INITIAL_Y+119;
		this.inputDOM.element_width = 390;
		this.inputDOM.element_height = 28;
		this.inputDOM.fontsize = 17;
		
		this.inputDOM.x = this.inputDOM.element_x ;
		this.inputDOM.y = this.inputDOM.element_y ;
		$(this.inputDOM.htmlElement).css("width",this.inputDOM.element_width);
		$(this.inputDOM.htmlElement).css("height",this.inputDOM.element_height );
		
		this.contenedor.addChild( this.inputDOM );
		
		
		var index = Main.navegador.split(' ')[0].indexOf("IE");
	    var mobil = Main.mobil;
		if(index > -1 && mobil =="Tablet"){
	        $input.focusout(function(event){ $("body").focus(); });
	        $(this.inputDOM.htmlElement).click( Motor.select );
	    }

    }
    this.keyPress = function(){
    	Contenedor.checkPagina();
    }
    this.select = function(){
		$(this).blur().focus();
	}
 	this.deleteInputs = function()
	{
		$( "input" ).each(function() {
		  $( this ).remove();
		});
	}
}
