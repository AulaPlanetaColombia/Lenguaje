
WordBuilder= new function()
{
	this.maxWidth = 915;
	this.palabras = new Array();
	this.palabrasItem = false;
	
	this.lineas = false; //
	this.getPalabras = function( texto )
	{
		//this.palabras = texto.split(" ");
		//tratamos los cambios de linea
		texto = texto.split("\n\r").join(" <nl> ");
		texto = texto.split("\r\n").join(" <nl> ");
		texto = texto.split("\n").join(" <nl> ");
		texto = texto.split("\r").join(" <nl> ");
		
		this.palabras = texto.split(" ");

		this.palabrasItem = new Array();
		
		for(key in this.palabras)
		{
			if( this.palabras[key].indexOf('|')>0)
			{
				
				var word = this.palabras[key];
				word = word.split("[").join(" [");
				word = word.split("]").join("] ");
				
				var words = word.split(" ");
				for(key3 in words)
				{
					if(words[key3].trim() != "")
					{
						if( words[key3].indexOf('|')>0)
						{
							var correccion = words[key3].split("|");
							var real = correccion[0].trim().substring(correccion[0].indexOf("[")+1, correccion[0].length);
							var correcta = correccion[1].trim().substring(0, correccion[1].indexOf("]")-1);
							//console.log(real+" - "+correcta);
							var palabra = new ParaulaItem( key, real, correcta );
							palabra.toCorrect = true;
							// añadimos espacio anterior
							this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
							// añadimos palabra
							this.palabrasItem.push( palabra );
							//añadimos espacio posterior
							this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
						}
						else
						{
							var word2 = words[key3].trim()
				
							// tratamos los signos de puntuacion como nuevas palabras
							word2 = this.spacePunct(word2);
							
							var words2 = word2.split(" ");
							
							for(key4 in words2)
							{
								if(words2[key4].trim() != "")
								{
									var real = words2[key4].trim();
									var correcta = words2[key4].trim();
									
									var palabra = new ParaulaItem( key, real, correcta );
									this.palabrasItem.push( palabra );
									//añadimos espacio despues de la palabra
									this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
								}
							}
						}
					}
				//}
				//else{
					
				//}
				}
			}
			else if( this.palabras[key].trim() != "") 
			{
				var word = this.palabras[key].trim()
				
				// tratamos los signos de puntuacion como nuevas palabras
				word = this.spacePunct(word);
				
				var words = word.split(" ");
				
				for(key2 in words)
				{
					if(words[key2].trim() != "")
					{
						var real = words[key2].trim();
						var correcta = words[key2].trim();
						
						var palabra = new ParaulaItem( key, real, correcta );
						this.palabrasItem.push( palabra );
						
						//añadimos espacio despues de la palabra
						this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
					}
				}
			}else{
				//añadimos espacio si hay espacio doble o triple
				this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
			}	
		}
		//console.log(this.palabras);
		return this.palabrasItem;
	}
	this.getPalabrasB = function( texto )
	{
		//this.palabras = texto.split(" ");
		//tratamos los cambios de linea
		texto = texto.split("\n\r").join(" <nl> ");
		texto = texto.split("\r\n").join(" <nl> ");
		texto = texto.split("\n").join(" <nl> ");
		texto = texto.split("\r").join(" <nl> ");
		
		this.palabras = texto.split(" ");

		this.palabrasItem = new Array();
		
		for(key in this.palabras)
		{
			if( this.palabras[key].indexOf('[')>=0)
			{
				
				var word = this.palabras[key];
				word = word.split("[").join(" [");
				word = word.split("]").join("] ");
				
				var words = word.split(" ");
				for(key3 in words)
				{
					if(words[key3].trim() != "")
					{
						if( words[key3].indexOf('[')>=0)
						{
							var correccion = words[key3];
							var real = correccion.trim().substring(correccion.trim().indexOf("[")+1, correccion.trim().indexOf("]"));
							//console.log(real+" - "+correcta);
							var palabra = new ParaulaItem( key, real );
							palabra.toCorrect = true;
							// añadimos espacio anterior
							this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
							// añadimos palabra
							this.palabrasItem.push( palabra );
							//añadimos espacio posterior
							this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
						}
						else
						{
							var word2 = words[key3].trim()
				
							// tratamos los signos de puntuacion como nuevas palabras
							word2 = this.spacePunct(word2);
							
							var words2 = word2.split(" ");
							
							for(key4 in words2)
							{
								if(words2[key4].trim() != "")
								{
									var real = words2[key4].trim();
									
									var palabra = new ParaulaItem( key, real );
									this.palabrasItem.push( palabra );
									//añadimos espacio despues de la palabra
									this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
								}
							}
						}
					}
				//}
				//else{
					
				//}
				}
			}
			else if( this.palabras[key].trim() != "") 
			{
				var word = this.palabras[key].trim()
				
				// tratamos los signos de puntuacion como nuevas palabras
				word = this.spacePunct(word);
				
				var words = word.split(" ");
				
				for(key2 in words)
				{
					if(words[key2].trim() != "")
					{
						var real = words[key2].trim();
						
						var palabra = new ParaulaItem( key, real );
						this.palabrasItem.push( palabra );
						//añadimos espacio despues de la palabra
									this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
					}
				}
			}else{
				//añadimos espacio si hay espacio doble o triple
				this.palabrasItem.push( new ParaulaItem( key, "<sp>", "<sp>" ) );
			}	
		}
		//console.log(this.palabras);
		return this.palabrasItem;
	}
	
	this.spacePunct = function( word )
	{
		word = word.split(".").join(" . ");
		word = word.split(",").join(" , ");
		word = word.split(":").join(" : ");
		word = word.split(";").join(" ; ");
		word = word.split("?").join(" ? ");
		word = word.split("¿").join(" ¿ ");
		word = word.split("!").join(" ! ");
		word = word.split("¡").join(" ¡ ");
		word = word.split("(").join(" ( ");
		word = word.split(")").join(" ) ");
		
		return word;
	} 
	this.getParrafos = function( palabrasArray )
	{
		var arrayWords = new Array();
		
		var parrafos =new Array();
		for(key1 in palabrasArray)
		{
			if(palabrasArray[key1].texto.text == "<nl>")
			{
				parrafos.push(arrayWords);
				arrayWords = new Array();
			}
			else
			{
				arrayWords.push( palabrasArray[ key1 ] );
			}				
		}
		parrafos.push(arrayWords);
		return parrafos;
	} 
	this.getLineas = function( palabrasArray )
	{
		var index =  0;
		var arrayWords = new Array();
		var ampleActual = 0;
		
		this.lineas =new Array();
		for(key1 in palabrasArray)
		{
			if(palabrasArray[key1].texto.text != "<sp>")
				ampleActual += palabrasArray[key1].texto.getMeasuredWidth()+7 ;
			//debugger;
			if(palabrasArray[key1].texto.text == "<nl>")
			{
				var linea = new LineaItem(index,arrayWords);
				this.lineas.push(linea);
				this.lineas.push("space");
				//console.log(linea);
				ampleActual  =0;
				arrayWords = new Array();
				index++;
			}
			else if(palabrasArray[key1].texto.text == "<sp>"){
				
			}
			else if( ampleActual <= this.maxWidth )
			{
				arrayWords.push( palabrasArray[ key1 ] );
				 
			}
			else{
				var linea = new LineaItem(index,arrayWords);
				this.lineas.push(linea);
				//console.log(linea);
				
				arrayWords = new Array();
				arrayWords.push( palabrasArray[ key1 ] );
				ampleActual = palabrasArray[key1].texto.getMeasuredWidth() + 7;
				index++;
			}	
				
		}
		var linea = new LineaItem(index,arrayWords);
		this.lineas.push(linea);
		
		return this.lineas;
	}
}
