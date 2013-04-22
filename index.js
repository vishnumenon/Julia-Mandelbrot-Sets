var MJE;

$(document).ready(function() {
	$('#explore_button').on('click', function(e){
		MJE = {};
		e.preventDefault();
		MJE.width = $(window).width();
		MJE.height = $(window).height();
		setDefualts();
		MJE.canvas = $('#explorer_graph')[0];
		MJE.ctx = MJE.canvas.getContext('2d');
		MJE.canvas.setAttribute('width', MJE.width);
		MJE.canvas.setAttribute('height', MJE.height);
		MJE.type = $('#equation').val();
		MJE.ca = parseFloat($('#a').val());
		MJE.cb = parseFloat($('#b').val());
		MJE.redraw = function() { drawGraph(); };
		MJE.reset = function() {
			setDefualts();
			drawGraph();
		};
		MJE.newEquation = function() {
			document.location.reload(true);
		};
		$('#start').hide();
		drawGraph();

		gui = new dat.GUI();
		gui.addColor(MJE, 'divergesColor').listen();
		gui.addColor(MJE, 'convergesColor').listen();
		gui.add(MJE, 'darkToLight');
		gui.add(MJE, 'redraw');
		gui.add(MJE, 'reset');
		gui.add(MJE, 'newEquation');

		return false;
	});
	$('#toImage').on('click',function(e){
		var url = MJE.canvas.toDataURL();
		w = window.open('saveImage.html');
		w.onload = function(){
			var placeholder = w.document.getElementById("fractalImage");
			placeholder.src = url;
		};
	});
	$('#explorer_graph').on('click', function(e){
		MJE.amax = getA(e.pageX, MJE.amin, MJE.amax, MJE.width) + 0.2 * (MJE.amax - MJE.amin);
		MJE.amin = getA(e.pageX, MJE.amin, MJE.amax, MJE.width) - 0.2 * (MJE.amax - MJE.amin);
		MJE.bmax = getB(e.pageY, MJE.bmin, MJE.bmax, MJE.height) + 0.2 * (MJE.bmax - MJE.bmin);
		MJE.bmin = getB(e.pageY, MJE.bmin, MJE.bmax, MJE.height) - 0.2 * (MJE.bmax - MJE.bmin);
		drawGraph();

	});
});

function setDefualts() {
	MJE.amin  = -2;
	MJE.amax  = 2;
	MJE.bmin  = (MJE.height / MJE.width) * -2;
	MJE.bmax  = (MJE.height / MJE.width) * 2;
	MJE.darkToLight = false;
	MJE.divergesColor = [255,255,255,255];
	MJE.convergesColor = [255,58,0,255];
}

function getA(x, min, max, width) {
	return (x * ((max - min) / width)) + min;
}

function getB(y, min, max, height) {
	return ((height - y) * ((max - min)/height)) + min;
}

function drawGraph() {
	MJE.rows = MJE.height;
	for(var i = 0; i<8; i++) {
		var worker = new Worker("graphworker.js");
		worker.addEventListener('message', createCallback(worker));
		worker.postMessage(generateMessage());

	}

}

function createCallback(worker) {
	return function(response) {
		var imageData = MJE.ctx.createImageData(MJE.width, 1);
		imageData.data.set(response.data.data);
		MJE.ctx.putImageData(imageData, 0, response.data.row);
		if(MJE.rows > 0) {
			worker.postMessage(generateMessage());
		}
	};
}

function generateMessage() {
	return {
		amin: MJE.amin,
		amax: MJE.amax,
		bmin: MJE.bmin,
		bmax: MJE.bmax,
		row: --MJE.rows,
		type: MJE.type,
		width: MJE.width,
		height: MJE.height,
		divergesColor: MJE.divergesColor,
		convergesColor: MJE.convergesColor,
		darkToLight: MJE.darkToLight,
		ca: MJE.ca,
		cb: MJE.cb
	};
}
