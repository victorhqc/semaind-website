(function(App){
	"use strict";

	var Module = function(){
		this.a = App;

		this.projects = this.a._data.proyectos;

		var recent = this.getRecentProjects(this.projects);
		this.buildSubMenu('sub-menu-proj-1', recent, 'titulo');

		var categories = this.getCategories(this.projects);
		this.buildSubMenu('sub-menu-proj-2', categories);

		this.amount = 5;

		this.renderProjects(this.amount, 0);
	}

	/**
	 * El menú en proyectos es un tanto más complejo y variable, puesto que se compone a partir de los proyectos existentes. Probablemente sea necesario implementar un json independiente del general o incluso una base de datos. Por el momento se tiene unicamente con un archivo plano para facilidad y comodidad.
	 * @return {undefined} No tiene valor de regreso
	 */
	Module.prototype.buildSubMenu = function(id, elms, desiredkey) {
		var menu = document.getElementById(id);
		menu.innerHTML = '';
		
		for(var i = 0, len = elms.length; i < len; i++){
			var el = elms[i];
			var li = document.createElement('li');

			if(desiredkey !== undefined && el.hasOwnProperty(desiredkey)){
				li.appendChild(document.createTextNode(el[desiredkey]));
			}else{
				li.appendChild(document.createTextNode(el));
			}

			li._data = el;

			menu.appendChild(li);
		}
	};

	/**
	 * El algoritmo será el siguiente:
	 *  1. Se ordenarán los proyectos por fecha.
	 *  2. Se obtendrán los últimos 5
	 * @param  {object} projects Arreglo de proyectos
	 * @return {object}          Arreglo de proyectos filtrados
	 */
	Module.prototype.getRecentProjects = function(projects) {
		var limit = 5;
		var recent = [];

		for(var i = 0, len = projects.length; i < len; i++){
			var proj = projects[i];
			if(recent.length < limit )
				recent.push(proj);
		}

		return recent;
	};

	/**
	 * Obtiene las categorías de los proyectos existentes, éste método no será necesario si se utiliza una base de datos
	 * @param  {object} projects Array de proyectos
	 * @return {object}          Array de categorías
	 */
	Module.prototype.getCategories = function(projects) {
		var categories = [];

		for(var i = 0, len = projects.length; i < len; i++){
			var proj = projects[i];

			if(proj.hasOwnProperty('categorias')){
				var cats = proj.categorias;

				for(var j = 0, len2 = cats.length; j < len2; j++){
					var cat = cats[j];

					if(categories.indexOf(cat) < 0){
						categories.push(cat);
					}
				}
			}
		}

		return categories;
	};

	Module.prototype.renderProjects = function(amount, index) {
		amount = (typeof amount === 'number') ? amount : 5;
		index = (typeof index === 'number') ? index : 0;

		$('html,body').scrollTop(0);

		var projects = this.projects;
		var init = amount * index;

		var container = document.getElementById('projects-container');
		container.innerHTML = '';

		for(var i = init, len = init + amount; i < len; i++){
			var proj = projects[i];
			if(proj === undefined){
				break;
			}

			var dProj = this.buildProject(proj);

			if(dProj !== null){
				container.appendChild(dProj);
			}
		}

		var pagination = this.buildPagination(amount, index);
		container.appendChild(pagination);
	};

	Module.prototype.buildProject = function(project) {
		var requiredkeys = ['titulo', 'descripcion', 'imgs', 'categorias'];

		for(var i = 0, len = requiredkeys.length; i < len; i++){
			var k = requiredkeys[i];
			if(project.hasOwnProperty(k) === false){
				return null;
			}
		}


		var main = document.createElement('div');
		main.className = 'project-container';

		var title = document.createElement('h2');
		title.className = 'blue';
		title.appendChild(document.createTextNode(project.titulo));
		main.appendChild(title);

		var imgs = document.createElement('div');
		imgs.className = 'row';
		main.appendChild(imgs);

		var classname = 'img-responsive col-sm-6 col-md-4 col-lg-3';
		var url = this.a._data.url_proyectos;
		for(var i = 0, len = project.imgs.length; i < len; i++){
			var img = project.imgs[i];

			var dImg = document.createElement('img');
			dImg.className = classname;
			dImg.src = url+img.img;
			imgs.appendChild(dImg);

			var a = i + 1;
			if(a % 2 === 0 || a % 3 === 0 || a % 4 === 0){
				var fix = document.createElement('div');
				fix.className = 'clearfix';
				imgs.appendChild(fix);
			}
		}

		var description = document.createElement('p');
		description.appendChild(document.createTextNode(project.descripcion));
		main.appendChild(description);

		return main;
	};

	Module.prototype.buildPagination = function(amount, index) {
		var projects = this.projects;

		var pagination = document.createElement('ul');
		pagination.className = 'pagination';

		var pages = Math.ceil(projects.length / amount);

		var first = document.createElement('li');
		var a_f = document.createElement('a');
		a_f.appendChild(document.createTextNode('<<'));
		first.appendChild(a_f);
		pagination.appendChild(first);

		a_f._t = this;
		a_f._index = 0;
		a_f.addEventListener('click', function(){
			this._t.renderProjects(this._t.amount, this._index);
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
				this._t.renderProjects(this._t.amount, this._index);
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
			this._t.renderProjects(this._t.amount, this._index);
		}, false);

		return pagination;
	};

	var m = new Module();
})(App);