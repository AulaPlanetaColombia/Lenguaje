Motor = new function()
{
	this.fons = "";
	this.contenedores = new Array();
	this.elementos = new Array();
	this.numeros = new Array();
	
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
	this.ini = false;
	this.fi = false;
	this.titolIni ="";
	this.titolFi = "";
	this.mutex = false;
	this.currentElement = null;
	this.maxElements = 5;
	this.heightElement = 60;
	this.separacioElement= 70;
	this.realElements = 0;
	
	this.ponerContenedor = function(contenedorMotor) {
	  //alert("Estoy caminando!");
	};
	
	this.cargarDatos = function()
	{
		$.get(pppPreloader.from("data", "data/datos.xml" + "?time=" + new Date().getTime()), function (xml) {

			Motor.maxElements = (Contenedor.datosXML.plataforma.grado == 1)? 5 : 6;
			Motor.heightElement = (Contenedor.datosXML.plataforma.grado == 1)? 60 : 50;
			Motor.separacioElement = (Contenedor.datosXML.plataforma.grado == 1)? 70 : 58 ;
			
			Motor.datosXML = new datosMotor();
			Motor.datosXML.enunciado = $(xml).find('enunciado').text();
			Motor.datosXML.imagen = $(xml).find('imagen').text();
			Motor.datosXML.ampliacion = $(xml).find('ampliacion').text();
			
			Motor.datosXML.orden.ini = $(xml).find('orden').attr('ini');
			Motor.datosXML.orden.fi = $(xml).find('orden').attr('fi');
			
			var counter = 0;
			$(xml).find('elemento').each(function(index) {
				//debugger;
				if( counter < Motor.maxElements){
					var ele = new elemento();
					ele.contestacion = $(this).attr('contestacion');
					ele.orden = $(this).attr('orden');
					ele.id=index;
					
				  	Motor.datosXML.elementos.push(ele);
			  	}
			  	counter++;
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
		Motor.cargarDatos();
	}
	this.estaCompletado = function(){
		return true;
	};
	
	this.getEstado = function(){
		var estado = new Array();
		for(var i=0; i < Motor.contenedores.length ; i++){
			for(var key in Motor.contenedores){
				if( i == Motor.contenedores[key].index ){
					if( Motor.contenedores[key].element != null ){
						estado.push( Motor.contenedores[key].element.orden-1 );
					}else{
						estado.push("");
					}
				}
			}
		}
		return estado.join(",");
	}
	
	this.revisar = function(){
		if(this.estado != "")
		{
			if( this.estado.indexOf("[")>=0 )
			{
				var datos = this.estado.substring(1, this.estado.length-1).split("][");
				Contenedor.timeRevision = datos[0];
				var estado = datos[1].split(",");
			}else{
				var estado = this.estado.split(",");
			}
			
			for(var key in estado)
			{
				for (key2 in Motor.elementos) {
					// mirar los id de respuesta que coincidan con el indice o posicion del array del estado
					if(estado[key] ==  parseInt(Motor.elementos[key2].orden) -1 )
					{ 
						for(key1 in Motor.contenedores){
							// el id de la pregunta que coincida con el id de pregunta del estado 
							if( key1 == key  )
							{
								Motor.contenedores[key1].setElement( Motor.elementos[key2]);
								Motor.contenedor.setChildIndex (Motor.elementos[key2].contenedor,  Motor.contenedor.getNumChildren () - 1 );
								
								Motor.elementos[key2].contenedor.x = Motor.contenedores[key1].contenedor.x + 1;
								Motor.elementos[key2].contenedor.y = Motor.contenedores[key1].contenedor.y + 1;
								break;
							}
						}
					}
				}
			}
		}
	}
		
	this.validar = function() {
		var total = 0;
	  	for (key in Motor.contenedores) {
	  		//console.log( Motor.contenedores[key].index + " - " +Motor.contenedores[key].element.orden);
			if(Motor.contenedores[key].index+1 == Motor.contenedores[key].element.orden)
			{
				Motor.contenedores[key].element.correcte();	
				total++;
			}else{
				Motor.contenedores[key].element.erronia();
			}
		}
		return total.toString() +  "/" + Motor.contenedores.length.toString();
	};
	this.hideDomObjects = function(){

	};
	this.showDomObjects = function(){

	};
	this.obtenerEstado = function(){
	  //alert("Hola, Soy" + this.primerNombre);
	};
	this.reiniciar = function() {
	  //alert("Estoy caminando!");
	};
	this.activar = function(){
		for (key in Motor.elementos) {
		 	// activem listeners de comportament de les respostes
	        Motor.elementos[key].contenedor.on("mousedown", Motor.preDragAndDrop, null, false, {element: Motor.elementos[key]});
	        Motor.elementos[key].contenedor.on("pressmove", Motor.dragAndDrop, null, false, {element: Motor.elementos[key]});
			Motor.elementos[key].contenedor.on("pressup", Motor.dropElement, null, false, {element: Motor.elementos[key]});
			Motor.elementos[key].contenedor.on("mouseover", function(evt){ document.body.style.cursor='pointer'; });
			Motor.elementos[key].contenedor.on("mouseout", function(evt){ document.body.style.cursor='default'; });
		}
	}
	this.desactivar = function() {
		for (key in Motor.elementos) {
		  	// desactivem listeners de comportament de les respostes
		  	Motor.elementos[key].contenedor.removeAllEventListeners ("mousedown");
		  	Motor.elementos[key].contenedor.removeAllEventListeners ("pressmove");
		  	Motor.elementos[key].contenedor.removeAllEventListeners ("pressup");
		  	Motor.elementos[key].contenedor.removeAllEventListeners("mouseover");
		  	Motor.elementos[key].contenedor.removeAllEventListeners("mouseout");
		}
		
	};
	this.numPaginas = function(){
		return 0;
	};
	this.ponerPagina = function(pag) {

	};
	this.obtenerPaginaActual = function(pag){

	};
	this.verSolucion = function(conEfecto){
	  
	  	this.recolocar();
	  	this.solucionar();
		this.desactivar();	
		
	};
	this.recolocar = function(){
		
	}
	this.solucionar = function(){
		var total = 0;
		this.solucion = false;
		
	  	for (key in Motor.contenedores) {
	  		//console.log( Motor.contenedores[key].index + " - " +Motor.contenedores[key].element.orden);
			if(Motor.contenedores[key].element.error)
			{
				//Eliminem marc de error
				Motor.contenedores[key].element.removeError();	
				
				// agafem coordenades del contenidor amb l'ordre correcte del element 
				var xfi = Motor.contenedores[Motor.contenedores[key].element.orden-1].contenedor.x + 1;
		    	var yfi = Motor.contenedores[Motor.contenedores[key].element.orden-1].contenedor.y + 1;
		    	
		    	createjs.Tween.get(Motor.contenedores[key].element.contenedor).to({x: xfi, y: yfi}, 500, createjs.Ease.circOut);
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
		
		this.drawTitols();
	    this.drawNumeros();
	    this.drawContenedores();
	    this.drawElementos();
	    
	    Main.stage.addChild( this.contenedor);
	    
    }
    this.drawTitols = function()
    {
    	this.ini = new createjs.Shape();
    	this.ini.graphics.beginFill("#FCDFB6").drawRoundRect(35, this.INITIAL_Y + 8, 875, 34, 5);
    	Main.stage.addChild( this.ini);
    	
    	this.titolIni = new createjs.RichText();
    	this.titolIni.font = (Contenedor.datosXML.plataforma.grado == 1)?  "16px Arial" : "14px Arial" ;
		this.titolIni.fontSize = 16;
		this.titolIni.color = "#0D3158";
		this.titolIni.text = Motor.datosXML.orden.ini ;
		this.titolIni.x = 45;
		this.titolIni.y = this.INITIAL_Y + 15 ;
		Main.stage.addChild( this.titolIni);
    	
    	this.fi = new createjs.Shape();
    	this.fi.graphics.beginFill("#FCDFB6").drawRoundRect(35, this.INITIAL_Y + 399, 875, 34, 5);
    	Main.stage.addChild( this.fi);
    	
		this.titolFi = new createjs.RichText();
    	this.titolFi.font = (Contenedor.datosXML.plataforma.grado == 1)?  "16px Arial" : "14px Arial" ;
		this.titolFi.fontSize = 16;
		this.titolFi.color = "#0D3158";
		this.titolFi.text = Motor.datosXML.orden.fi ;
		this.titolFi.x = 45;
		this.titolFi.y = this.INITIAL_Y + 406;
		Main.stage.addChild( this.titolFi);
    }
    this.drawNumeros = function()
    {   
		Motor.numeros = new Array();
    	//dibuixem caixa i preguntes
    	for(i=0; i < Motor.datosXML.elementos.length; i++)
    	{
			//creem pregunta
	       	var num = new Numero((i+1).toString());
	        num.contenedor.x = 35 ;
	        num.contenedor.y =  this.INITIAL_Y + this.separacioElement * i + 49 + i * ( this.separacioElement * ( this.maxElements  - Motor.datosXML.elementos.length ) ) / (Motor.datosXML.elementos.length-1); 
			num.idNumero = i;
			
	        this.contenedor.addChild( num.contenedor );

	        //guardem marc inicial en un array per despres treballar em ells
	        Motor.numeros.push(num);
    	
    	}
    	
    }
    this.drawContenedores = function()
    {
    	Motor.contenedores = new Array();
    	var elementos = Motor.datosXML.elementos;
    	// dibuixem marcs de cabuda de resposta
    	for(var i=0; i < elementos.length ; i++)
    	{
    		var base = new BaseElemento(i, 837, this.heightElement+2 , 10);
	        base.contenedor.x = 79 ;
	        base.contenedor.y = this.INITIAL_Y + this.separacioElement * i + 49 + i * ( this.separacioElement * ( this.maxElements  - elementos.length ) ) / (elementos.length-1) ; 

	        this.contenedor.addChild( base.contenedor );
	        //guardem marc inicial en un array per despres treballar em ells
	        Motor.contenedores.push(base);
    	}
    }
    
    this.drawElementos = function()
    {
    	Motor.elementos = new Array();

    	var elementos = Motor.datosXML.elementos;
    	var numElementos = elementos.length;
    	for(var i=0; i < numElementos ; i++)
    	{
    		// creem random o no.
    		var index = 0;
    		if(Contenedor.datosXML.sinaleatoriedad == 0 && Scorm.modo != Scorm.MODO_REVISAR && Scorm.modo != Scorm.MODO_REVISARALUMNO )
			{
				index = Math.floor(Math.random()*elementos.length);
			}
		
			var elemento = elementos[index];
			elementos.splice(index,1);
			
	        // creem caixa element
	        var el = new Elemento( elemento.contestacion, elemento.orden, 835, this.heightElement, 10) ;
	        el.contenedor.x = 80;
	        el.contenedor.y = this.INITIAL_Y + this.separacioElement* i + 50 + i * ( this.separacioElement * ( this.maxElements  - numElementos) ) / (numElementos-1);
	        el.idElement = elementos.id;
	        
	        //console.log(el.idElement);
	        
			//guardem resposta dins marc
	    	Motor.elementos.push(el);
	    	Motor.contenedores[i].setElement(el);
	        
	       	this.contenedor.addChild( el.contenedor );

			// activem listeners de comportament de les respostes
	        el.contenedor.on("mousedown", this.preDragAndDrop, null, false, {element:el});
	        el.contenedor.on("pressmove", this.dragAndDrop, null, false, {element:el});
			el.contenedor.on("pressup", this.dropElement, null, false, {element:el});
			el.contenedor.on("mouseover", function(evt){ document.body.style.cursor='pointer'; });
			el.contenedor.on("mouseout", function(evt){ document.body.style.cursor='default'; });
		}
    }
    
    this.preDragAndDrop = function(evt, data)
    {
    	if(!Motor.mutex && Motor.currentElement == null){
    		Motor.currentElement = data.element;
	    	// capturem punt de click dins la resposta
	    	Motor.itemX = evt.stageX/Main.scale - evt.target.parent.x ;
	    	Motor.itemY = evt.stageY/Main.scale - evt.target.parent.y ;
	    	// coloquem reposta al davant
	    	Motor.contenedor.setChildIndex ( evt.target.parent,  Motor.contenedor.getNumChildren () - 1 );
	    	//activem color seleccio i sombra de la resposta
	    	data.element.lightResponse();
    	}
    	
	}
    
    this.dragAndDrop = function(evt,data)
    {
    	if(!Motor.mutex && Motor.currentElement == data.element){
		    evt.target.parent.x = evt.stageX/Main.scale - Motor.itemX;
			evt.target.parent.y = evt.stageY/Main.scale - Motor.itemY;
		}
    }
    
    this.dropElement = function(evt, data)
    {
    	if(!Motor.mutex && Motor.currentElement == data.element){
    		Motor.mutex = true;
	    	// desactivem color seleccio i sombra del origen
	    	data.element.unlightResponse();
	    	
	    	var trobat = false;
	    	for (key in Motor.elementos) {
	    		if( data.element.index != Motor.elementos[key].index)
	    		{
					var pt = Motor.elementos[key].contenedor.globalToLocal( (evt.target.parent.x  + 420)* Main.scale, (evt.target.parent.y + 30)* Main.scale );
				   
				    // si colisiona amb un altre element
				    if ( evt.target.parent.children[0].hitTest( pt.x , pt.y )) {
				    	// coordenades del element desti
			    		var xfi1 = Motor.elementos[key].base.contenedor.x +1;
			    		var yfi1 = Motor.elementos[key].base.contenedor.y+1;
	
						// coordenades del element origen
						var xfi2 = data.element.base.contenedor.x +1;
			    		var yfi2 = data.element.base.contenedor.y +1;
			    		
			    		// coloquem l'element desti a la casella de l'element origen
			    		Motor.contenedor.setChildIndex ( Motor.elementos[key].contenedor,  Motor.contenedor.getNumChildren () - 1 );
			    		createjs.Tween.get(Motor.elementos[key].contenedor).to({x: xfi2, y: yfi2}, 500, createjs.Ease.circOut).call( function(base , element){ base.setElement(element); Motor.mutex = false;}, [data.element.base, Motor.elementos[key]]);
			    		
			    		// coloquem l'element origen a la casella de l'element destí
			    		createjs.Tween.get(evt.target.parent).to({x: xfi1, y: yfi1}, 150, createjs.Ease.circOut).call( function(base , element){ base.setElement(element); }, [Motor.elementos[key].base, data.element]);;
				        
				        trobat = true;
				    }
			    }
			}
			if(!trobat)  // no ha colisionat amb cap altre element
			{
				for (key in Motor.contenedores) {
					if(Motor.contenedores[key].element.index == data.element.index)
					{
						// tornem l'element origen a la seva posicio inicial
				        createjs.Tween.get(evt.target.parent).to({x:Motor.contenedores[key].contenedor.x+1}, 350, createjs.Ease.circOut).call(function(){ Motor.mutex = false;});
			    		createjs.Tween.get(evt.target.parent).to({y:Motor.contenedores[key].contenedor.y+1}, 350, createjs.Ease.circOut);
	
					}
				}
			}
			Motor.currentElement = null;
		}
    }

}