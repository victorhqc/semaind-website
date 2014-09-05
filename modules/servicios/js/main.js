(function(window, App){
	"use strict";
	
	var Module = function(){
		this.a = App;

		this.contenedor = document.getElementById('contenedor-equipo');
		this.renderEquipment();
	}

	Module.prototype.renderEquipment = function() {
		//Se mostrarán 3 equipos por renglón en equipos grandes y medianos
		//2 en chicos y uno en teléfonos
		this.contenedor.innerHTML = '';
		
		var equipo = this.a._data.servicios;
		var url = this.a._data.url_servicios;

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
				var atitle = document.createElement('a');
				atitle.className = 'blue';
				atitle.setAttribute('data-ltag', eq);

				title.appendChild(atitle);

				var text = document.createTextNode(this.a.current.getText(eq));
				atitle.appendChild(text);

				dom.appendChild(img);
				dom.appendChild(title);
				this.contenedor.appendChild(dom);

				atitle._t = this;
				atitle._category = eq;
				atitle.addEventListener('click', function(){
					this._t.render_album(this._category);
				}, false);

				if(aux % 3 === 0){
					var fix = this.create_clearfix('visible-md visible-lg');
					this.contenedor.appendChild(fix);
				}

				if(aux % 2 === 0){
					var fix = this.create_clearfix('clearfix visible-sm');
					this.contenedor.appendChild(fix);	
				}

				aux++;
			}
		}
	};

	Module.prototype.album_validator = function(category) {
		var service = this.a._data.servicios[category];
		if(typeof service.album === 'undefined' || typeof service.url === 'undefined'){
			return;
		}

		return service;
	};

	Module.prototype.build_main = function(category) {
		var main = this.build_default_album_container();

		var title = document.createElement('h1');
		title.className = 'blue';
		title.setAttribute('data-ltag', category);
		var text = document.createTextNode(this.a.current.getText(category));
		title.appendChild(text);

		main.appendChild(title);

		return main;
	};

	Module.prototype.render_album = function(category) {
		var service = this.album_validator(category);
		
		if(service.featured === true){
			this.render_featured_album(category);
			return;
		}

		this.contenedor.innerHTML = '';
		var main = this.build_main(category);

		//Building the descriptions
		this.build_descriptions(service, category, main);

		//Building the album grid
		this.build_album(service, main);

		this.build_back(main);
	};

	Module.prototype.render_featured_album = function(category) {
		var service = this.album_validator(category);
		this.contenedor.innerHTML = '';

		//Build banner
		var url = service.url;
		var banner_pic = url + service.banner;
		var banner = document.createElement('img');
		banner.className = 'img-responsive';
		banner.id = 'service_banner';
		banner.src = banner_pic;
		this.contenedor.appendChild(banner);

		var main = this.build_main(category);
		main.className = 'row';

		var text_container = document.createElement('div');
		text_container.className = 'col-sm-7 col-md-8';
		main.appendChild(text_container);

		//Building the descriptions
		this.build_descriptions(service, category, text_container);

		var album_container = document.createElement('div');
		album_container.className = 'col-sm-5 col-md-4';
		main.appendChild(album_container);

		//Building the album grid
		this.build_album(service, album_container);

		this.build_back(main);
	};

	Module.prototype.build_default_album_container = function(category) {
		var main = document.createElement('div');
		main.id = 'main_service';
		this.contenedor.appendChild(main);

		return main;
	};

	Module.prototype.build_descriptions = function(service, category, main) {
		var url = service.url;
		for(var j = 0, len = service.descriptions.length; j < len; j++){
			var desc = service.descriptions[j];

			var desc_tag = category+'-description';
			var title_desc = desc.title;
			if(title_desc !== ''){
				desc_tag = title_desc+'-description';

				var tit = document.createElement('h4');
				tit.className = 'blue';
				var ltag = title_desc;
				tit.setAttribute('data-ltag', ltag);
				tit.appendChild(document.createTextNode(this.a.current.getText(ltag)));

				main.appendChild(tit);
			}

			var description = document.createElement('p');
			description.setAttribute('data-ltag', desc_tag);
			
			var text_desc = document.createTextNode(this.a.current.getText(desc_tag));
			description.appendChild(text_desc);

			main.appendChild(description);

			if(typeof desc.max_dim !== 'undefined'){
				var maxes = desc.max_dim;
				var max_d_tag = 'max-dim';
				var max_dim = document.createElement('h4');
				
				max_dim.setAttribute('data-ltag', max_d_tag);

				var text_m = document.createTextNode(this.a.current.getText(max_d_tag));
				max_dim.appendChild(text_m);

				main.appendChild(max_dim);

				var max_list = document.createElement('ul');
				main.appendChild(max_list);

				for(var k = 0, lenk = maxes.length; k < lenk; k++){
					var max = maxes[k];
					var max_desc = document.createElement('li');
					max_desc.appendChild(document.createTextNode(max));

					max_list.appendChild(max_desc);
				}
			}
		}
	};

	Module.prototype.build_back = function(main) {
		var back_holder = document.createElement('h4');
		var back = document.createElement('a');
		back.className = 'blue';
		back.setAttribute('data-ltag', 'back');
		var t = document.createTextNode(this.a.current.getText('back'));
		back.appendChild(t);

		back_holder.appendChild(back);
		main.appendChild(back_holder);

		back._t = this;
		back.addEventListener('click', function(){
			this._t.renderEquipment();
		}, false);
	};

	Module.prototype.build_album = function(service, main) {
		var album = service.album;
		var url = service.url;

		var album_container = document.createElement('div');
		album_container.id = 'album_container';
		album_container.className = 'row';
		main.appendChild(album_container);

		var number_pics = service.pic_per_row;
		number_pics = this.calculate_number_rows(number_pics);

		var aux = 1;
		for(var i = 0, len_a = album.length; i < len_a; i++){
			var pic = album[i];
			var pic_img = pic.img;

			var col = document.createElement('div');
			col.className = 'col-sm-'+number_pics.cols;
			album_container.appendChild(col);

			var a = document.createElement('a');
			a.className = 'thumbnail';
			col.appendChild(a);

			var img = document.createElement('img');
			img.className = 'img-responsive';
			img.src = url+pic_img;
			a.appendChild(img);

			if(aux % number_pics.number === 0){
				var fix = this.create_clearfix('visible-md visible-lg visible-sm');
				album_container.appendChild(fix);
			}

			aux++;
		}

		//After the album grid is created, a clearfix is needed
		var fix = this.create_clearfix();
		main.appendChild(fix);
	};

	Module.prototype.calculate_number_rows = function(number) {
		number = (typeof number === 'number') ? number : 3;
		var response = {number: number};

		//Max amount allowed by bootstrap is 12
		var max = 12;
		var min = 1;

		var amount = max / number;
		//if there's an error, de default number will be 3 columns per row
		amount = (amount <= max && amount >= min) ? amount : 4;
		response.cols = amount;

		return response;
	};

	Module.prototype.create_clearfix = function(classname) {
		classname = (typeof classname === 'string') ? classname : '';

		var fix = document.createElement('div');
		fix.className = 'clearfix ' + classname;

		return fix;
	};

	var m = new Module();
})(window, App);