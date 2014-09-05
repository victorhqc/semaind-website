var App;

window.dhtmlHistory.create({
	toJSON: function(o) {
		return JSON.stringify(o);
	}
	, fromJSON: function(s) {
		return JSON.parse(s);
	}
});

(function(window, App){
	"use strict";

	var Main = function(){
		this.getConfig(function(r, t){
			var modules = Object.keys(r.modules)
			t.buildMenu(modules);

			t.start(r);
		});
	}

	/**
	 * Gets the main site configuration
	 * @return {json} Configuration
	 */
	Main.prototype.getConfig = function(callback) {
		var t = this;
		new Vi({url:'config.json', 'respuesta': 'objeto'}).server(function(r){
			if(typeof callback === 'function'){
				callback(r, t);
			}
		});
	};

	Main.prototype.start = function(r) {
		var lang = this.browserLanguage();
		var modules = {};

		for(var k in r.modules){
			if(r.modules.hasOwnProperty(k)){
				modules[k] = {nombre: k, url:r.url};
			}
		}

		var j = {name: 'semanaid', modules:modules, div:'#container', currentLang: lang};
		this.a = new AppSystem(j);
		window.App = this.a;

		this.a._data = r;
		var t = this;

		dhtmlHistory.initialize();
		dhtmlHistory.addListener(t.handleHistory);

		this.a.init(function(){
			var initialModule = dhtmlHistory.getCurrentLocation();
			if(initialModule == '/' || initialModule == ''){
				t.loadCategory('inicio');
			}else{
				var c = initialModule.substr(1);
				t.loadCategory(c);
			}
		});
	};

	Main.prototype.handleHistory = function(newLocation, historyData) {
		var category = newLocation.substr(1);
		m._cat = category;
		if(typeof m.a.current === 'object'){
			m.loadCategory(category);
		}
	};

	Main.prototype.buildMenu = function(modules) {

		//For the extra details for each category, in some cases is needed an orange ">" an others a white arrow
		//So these variables are used for that effect
		var extras = {
			arrow: {'inicio': '', 'equipo': ''}, // <--- after
			bar: {'empresa': '', 'productos': '', 'proyectos': '', 'servicios': ''}, // <--- after
			triangle: {'productos': '', 'proyectos': '', 'servicios': '', 'equipo': ''} // <--- before
		};

		this.menu = document.getElementById('main-menu');
		for(var i = 0, len = modules.length; i < len; i++){
			var m = modules[i];
			var li = document.createElement('li');
			li.id = 'm-'+m;

			var a = document.createElement('a');
			a.className = 'a-float';
			a.setAttribute('data-ltag', m);
			a.setAttribute('data-module', m);

			li.appendChild(a);
			this.menu.appendChild(li);

			for(var e in extras){
				if(extras.hasOwnProperty(e)){
					if(extras[e].hasOwnProperty(m)){
						var elm = this['build_'+e]();

						switch(e){
							//after
							case 'arrow':
							case 'bar':
								$(a).after(elm);
							break;
							//before
							case 'triangle':
								$(a).before(elm);
							break;
						}
					}
				}
			}

			var clear = document.createElement('div');
			clear.className = 'clearfix';
			li.appendChild(clear);

			a._t = this;
			a.addEventListener('click', function(){
				var category = this.getAttribute('data-module');
				this._t.loadCategory(category);
			});
		}
	};

	Main.prototype.build_bar = function() {
		var container = document.createElement('span');
		container.className = 'bar-menu';

		return container;
	};

	Main.prototype.build_triangle = function() {
		var container = document.createElement('span');
		container.className = 'triangle-menu';
		var t = document.createTextNode('>');
		container.appendChild(t);

		return container;
	};

	Main.prototype.build_arrow = function() {
		var container = document.createElement('div');
		container.className = 'arrow-container';

		return container;
	};

	Main.prototype.cleanMenuCategory = function() {
		var lis = document.querySelectorAll('#main-menu>li');
		for(var i = 0, len = lis.length; i < len; i++){
			var li = lis[i];
			li.className = '';
		}
	};

	Main.prototype.activeMenuCategory = function(category) {
		var el = document.getElementById('m-'+category);
		this.cleanMenuCategory();
		el.className = 'active';
	};

	Main.prototype.loadCategory = function(category) {
		dhtmlHistory.add('/'+category, {message: "Module " +category});
		this.activeMenuCategory(category);

		this.a.getModule(category);
		this.a.current.start();
	};

	Main.prototype.browserLanguage = function() {
		var lang = navigator.language || navigator.userLanguage;
		lang = lang.match(/([a-z]+)/gi);
		if(lang !== null){
			lang = lang[0];
		}

		var l = '';
		switch(lang){
			case 'es':
				l = lang;
			break;
			default:
			case 'en':
				l = lang;
			break;
		}

		return l;
	};

	var m = new Main();
})(window, App);