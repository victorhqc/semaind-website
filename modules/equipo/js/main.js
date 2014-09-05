(function(window, App){
	"use strict";
	
	var Module = function(){
		this.a = App;

		this.renderEquipment();
	}

	Module.prototype.renderEquipment = function() {
		//Se mostrarán 3 equipos por renglón en equipos grandes y medianos
		//2 en chicos y uno en teléfonos
		
		var equipo = this.a._data.equipo;
		var url = this.a._data.url_equipo;

		var contenedor = document.getElementById('contenedor-equipo');
		var classname = 'col-sm-6 col-md-4';

		var aux = 1;
		for(var eq in equipo){
			if(equipo.hasOwnProperty(eq)){
				var dom = document.createElement('div');
				dom.className = classname;

				var img = document.createElement('img');
				img.className = 'img-responsive';
				img.src = url + equipo[eq].img;

				var title = document.createElement('h3');
				title.className = 'blue';
				title.setAttribute('data-ltag', eq);

				var text = document.createTextNode(this.a.current.getText(eq));
				title.appendChild(text);

				dom.appendChild(img);
				dom.appendChild(title);
				contenedor.appendChild(dom);

				if(aux % 3 === 0){
					var fix = document.createElement('div');
					fix.className = 'clearfix visible-md visible-lg';
					contenedor.appendChild(fix);
				}

				if(aux % 2 === 0){
					var fix = document.createElement('div');
					fix.className = 'clearfix visible-sm';
					contenedor.appendChild(fix);	
				}

				aux++;
			}
		}
	};

	var m = new Module();
})(window, App);