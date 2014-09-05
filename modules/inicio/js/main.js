(function(App){
	"use strict";

	var Module = function(){
		this.a = App;

		this.imgs = this.a._data.galeria;
		this.url = this.a._data.url_galeria;

		this.props = {};

		this.slider = document.getElementById('slider');

		this.initializeGallery();
	}

	/*
	<img src="gallery/demo1/assassins1.jpg" alt="This is an example of a simple caption" data-caption-position="bottom" data-transition='{"effect": "cubeUp", "slices": 9, "animSpeed": 1200, "delay": 100, "delayDir": "fromCentre", "easing": "easeInOutBack", "depthOffset": 300, "sliceGap": 30}' />
		<img src="gallery/demo1/deus-ex1.jpg" alt="" data-captionelem="#caption" data-caption-position="top" data-transition='{"effect": "cubeRight", "slices": 5, "delay": 200}' />
		<img src="gallery/demo1/batman.jpg" alt="Images can also serve as links. To see this in effect click on this slide image" data-caption-position="left" data-href="http://google.com" data-transition='{"effect": "cubeDown", "slices": 15, "animSpeed": 3000, "delay": 30, "easing": "easeInOutElastic", "depthOffset": 200, "sliceGap": 20}' />
		<img src="gallery/demo1/prince.jpg" alt="" data-transition='{"effect": "cubeLeft", "slices": 5, "delay": 200, "delayDir": "toCentre"}' />
		<img src="gallery/demo1/assassins2.jpg" alt="" data-transition='{"effect": "cubeUp", "slices": 5, "animSpeed": 1300, "delay": 100, "easing": "easeInOutCubic", "depthOffset": 500, "sliceGap": 50}' />
		<img src="gallery/demo1/deus-ex2.jpg" alt="" data-transition='{"effect": "cubeRight", "slices": 5, "delay": 200, "delayDir": "last-first"}' />	
	 */
	
	Module.prototype.getDimentions = function() {
		var r = {width: 900, height: 350};

		return r;
	};

	Module.prototype.setGalleryProps = function() {
		this.props.effect = 'cubeUp';
		this.props.slices = 9;
		this.props.animSpeed = 1200;
		this.props.delay = 100;
		this.props.delayDir = 'fromCentre';
		this.props.easing = 'easeInOutBack';
		this.props.depthOffset = 300;
		this.props.sliceGap = 30;
		this.props.pauseTime = 5000;
	};

	Module.prototype.generateImgs = function() {
		this.setGalleryProps();

		var props = JSON.stringify(this.props);

		this.slider.innerHTML = '';

		for(var i = 0, len = this.imgs.length; i < len; i++){
			var imgobj = this.imgs[i];

			var img = document.createElement('img');
			img.src = this.url + imgobj.img;
			img.alt = img.title;
			img.setAttribute('data-transition', props);

			this.slider.appendChild(img);

		}
	};

	Module.prototype.initializeGallery = function() {
		this.generateImgs();

		var dimentions = this.getDimentions();

		$(this.slider).ccslider({
			_3dOptions: {
				imageWidth: dimentions.width,
				imageHeight: dimentions.height
			}
		});
	};

	var m = new Module();
})(App);