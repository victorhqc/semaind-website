(function(App){
	"use strict";

	var Module = function(App){
		this.a = App;
		this.products = this.a._data.productos;
		this.products_url = this.a._data.url_productos;

		this.amount = 6;

		this.buildMenu();
	}

	Module.prototype.buildMenu = function() {
		var obj = this.buildCategories();
		var container = document.getElementById('sub-menu-products');
		container.innerHTML = '';

		for(var k in obj){
			if(obj.hasOwnProperty(k)){
				var title = document.createElement('h3');
				title.className = 'blue';
				var text = this.a.current.getText(k);
				title.appendChild(document.createTextNode(text));

				title._data = obj[k].products;
				title._t = this;
				title._type = k;
				title.addEventListener('click', function(){
					var lis = container.getElementsByTagName('li');
					for(var i = 0, len = lis.length; i < len; i++){
						lis[i].className = '';
					}

					this._t.setTitle(this._type, this._category);
					this._t.loadProducts(this._data);
				}, false);

				container.appendChild(title);

				var submenu = document.createElement('ul');
				submenu.className = 'nav nav-pills nav-stacked';

				var categories = obj[k].categories;
				for(var l in categories){
					if(categories.hasOwnProperty(l)){
						var option = document.createElement('li');

						var a = document.createElement('a');
						var text = this.a.current.getText(l);
						a.appendChild(document.createTextNode(text));
						option.appendChild(a);

						a._t = this;
						a._data = categories[l];
						a._type = k;
						a._category = l;
						a.addEventListener('click', function(){
							this._t.setTitle(this._type, this._category);
							this._t.loadProducts(this._data);

							var lis = container.getElementsByTagName('li');
							for(var i = 0, len = lis.length; i < len; i++){
								lis[i].className = '';
							}
							this.parentNode.className = 'active';
						}, false);

						submenu.appendChild(option);
					}
				}

				container.appendChild(submenu);
			}
		}
	};

	Module.prototype.buildCategories = function() {
		var products = this.products;

		var types = {};

		for(var i = 0, len = products.length; i < len; i++){
			var product = products[i];

			if(product.hasOwnProperty('tipos')){
				var tipos = product.tipos;
				for(var j = 0, len2 = tipos.length; j < len2; j++){
					var tipo = tipos[j];

					if(types.hasOwnProperty(tipo) === false){
						types[tipo] = {categories: {}, products: []};
					}

					types[tipo].products.push(i);

					if(product.hasOwnProperty('categorias')){
						var categorias = product.categorias;
						for(var k = 0, len3 = categorias.length; k < len3; k++){
							var categoria = categorias[k];
							if(types[tipo].categories.hasOwnProperty(categoria) === false){
								types[tipo].categories[categoria] = [];
							}

							types[tipo].categories[categoria].push(i);
						}
					}
				}
			}
		}

		return types;
	};

	Module.prototype.loadProducts = function(products, index) {
		index = (typeof index === 'number') ? index : 0;

		$('html,body').scrollTop(0);

		var container = document.getElementById('products-container');
		if(container === null)
			return;

		container.innerHTML = '';
		var classname = 'col-sm-6 col-md-4';
		var fullproducts = this.products;

		var len = this.amount * (index + 1);
		var init = this.amount * index;
		for(var i = init; i < len && i < products.length; i++){
			var p = products[i];
			var product = fullproducts[p];

			var main = document.createElement('div');
			main.className = classname;

			var img = document.createElement('img');
			img.className = 'img-responsive';
			img.src = this.products_url + product.img;
			main.appendChild(img);

			var title = document.createElement('h4');
			var name = this.a.current.getText(product.nombre);
			title.appendChild(document.createTextNode(name));
			main.appendChild(title);

			var a = i + 1;
			if(a % 2 === 0 || a % 3 === 0){
				var fix = document.createElement('div');
				fix.className = 'clearfix';
				main.appendChild(fix);
			}

			container.appendChild(main);
		}

		var pagination = this.buildPagination(products, index);
		var pag = document.getElementById('pagination');
		pag.innerHTML = '';
		pag.appendChild(pagination);
	};

	Module.prototype.setTitle = function(type, category) {
		var container = document.getElementById('title-container');
		if(container === null)
			return;

		container.innerHTML = '';

		var main = document.createElement('h2');
		main.className = 'blue';
		var title = document.createElement('span');
		var text = this.a.current.getText(type);
		title.appendChild(document.createTextNode(text));
		main.appendChild(title);

		if(typeof category !== 'undefined'){
			var subtitle = document.createElement('small');
			var subtext = this.a.current.getText(category);
			subtitle.appendChild(document.createTextNode(' '+subtext));
			main.appendChild(subtitle);
		}

		container.appendChild(main);
	};

	Module.prototype.buildPagination = function(products, index) {
		var pagination = document.createElement('ul');
		pagination.className = 'pagination';

		var pages = Math.ceil(products.length / this.amount);

		var first = document.createElement('li');
		var a_f = document.createElement('a');
		a_f.appendChild(document.createTextNode('<<'));
		first.appendChild(a_f);
		pagination.appendChild(first);

		a_f._t = this;
		a_f._index = 0;
		a_f.addEventListener('click', function(){
			this._t.loadProducts(products, this._index);
		}, false);

		for(var i = 0, len = pages; i < len; i++){
			var page = document.createElement('li');
			var a = document.createElement('a');
			a.appendChild(document.createTextNode( i + 1));
			page.appendChild(a);

			if(i === index){
				page.className = 'active';
			}

			pagination.appendChild(page);

			a._t = this;
			a._index = i;
			a.addEventListener('click', function(){
				this._t.loadProducts(products, this._index);
			}, false);
		}

		var last = document.createElement('li');
		var a_l = document.createElement('a');
		a_l.appendChild(document.createTextNode('>>'));
		last.appendChild(a_l);
		pagination.appendChild(last);

		a_l._t = this;
		a_l._index = pages - 1;
		a_l.addEventListener('click', function(){
			this._t.loadProducts(products, this._index);
		}, false);

		return pagination;
	};

	var m = new Module(App);
})(App);