var MJE;

$(document).ready(function() {
	$('#explore_button').on('click', function(e){
		MJE = {};
		e.preventDefault();
		MJE.width = $(window).width();
		MJE.height = $(window).height();
		MJE.amin  = -2;
		MJE.amax  = 2;
		MJE.bmin  = -2;
		MJE.bmax  = 2;
		MJE.colors = {};
		MJE.divergesColor1 = [255,255,255,255];
		MJE.divergesColor2 = [0,0,0,255];
		MJE.convergesColor = [100,100,100,255];
		MJE.canvas = $('#explorer_graph')[0];
		MJE.controlCanvas = $('#controls')[0];
		MJE.ctx = MJE.canvas.getContext('2d');
		MJE.cctx = MJE.controlCanvas.getContext('2d');
		MJE.canvas.setAttribute('width', MJE.width);
		MJE.canvas.setAttribute('height', MJE.height);
		MJE.controlCanvas.setAttribute('width', MJE.width);
		MJE.controlCanvas.setAttribute('height', MJE.height);
		MJE.type = $('#equation').val();
		MJE.drawing = false;
		MJE.drawStart = {a: 0, b: 0};
		MJE.redraw = function() { drawGraph(); };
		MJE.reset = function() {
			MJE.amin = -2;
			MJE.amax = 2;
			MJE.bmin = -2;
			MJE.bmax = 2;
			MJE.divergesColor1 = [255,255,255,255];
			MJE.divergesColor2 = [0,0,0,255];
			MJE.convergesColor = [100,100,100,255];
			drawGraph();
		};
		$('#start').hide();
		drawGraph();

		gui = new dat.GUI();
		gui.addColor(MJE, 'divergesColor1').listen();
		gui.addColor(MJE, 'divergesColor2').listen();
		gui.addColor(MJE, 'convergesColor').listen();
		gui.add(MJE, 'redraw');
		gui.add(MJE, 'reset');

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
	$('#controls').on('mousedown', function(e) {
		MJE.drawing = true;
		MJE.drawStart.x = e.pageX;
		MJE.drawStart.y = e.pageY;
		return false;
	});
	$('#controls').on('mousemove', function(e) {
		if(MJE.drawing) {
			MJE.cctx.clearRect(0,0,MJE.width, MJE.height);
			MJE.cctx.globalAlpha = 0.3,
			MJE.cctx.fillStyle = '#ffffff';
			MJE.cctx.fillRect(Math.min(MJE.drawStart.x, e.pageX), Math.min(MJE.drawStart.y, e.pageY), Math.max(MJE.drawStart.x, e.pageX) - Math.min(MJE.drawStart.x, e.pageX), Math.max(MJE.drawStart.y, e.pageY) - Math.min(MJE.drawStart.y, e.pageY));
		}
	});
	$('#controls').on('mouseup', function(e) {
		MJE.amin = getA(Math.min(MJE.drawStart.x, e.pageX), MJE.amin, MJE.amax, MJE.width);
		MJE.amax = getA(Math.max(MJE.drawStart.x, e.pageX), MJE.amin, MJE.amax, MJE.width);
		MJE.bmin = getB(Math.max(MJE.drawStart.y, e.pageY), MJE.bmin, MJE.bmax, MJE.height);
		MJE.bmax = getB(Math.min(MJE.drawStart.y, e.pageY), MJE.bmin, MJE.bmax, MJE.height);
		MJE.cctx.clearRect(0,0,MJE.width, MJE.height);
		MJE.drawing = false;
		drawGraph();
	});
});

function getA(x, min, max, width) {
	return (x * ((max - min) / width)) + min;
}

function getB(y, min, max, height) {
	return ((height - y) * ((max - min)/height)) + min;
}

function drawGraph() {
	MJE.rows = MJE.height;
	for(var i = 0; i<10; i++) {
		var worker = new Worker("graphworker.js");
		worker.addEventListener('message', createCallback(worker));
		worker.postMessage({
			amin: MJE.amin,
			amax: MJE.amax,
			bmin: MJE.bmin,
			bmax: MJE.bmax,
			row: --MJE.rows,
			type: MJE.type,
			width: MJE.width,
			height: MJE.height,
			divergesColor1: MJE.divergesColor1,
			divergesColor2: MJE.divergesColor2,
			convergesColor: MJE.convergesColor
		});

	}

}

function createCallback(worker) {
	return function(response) {
		var imageData = MJE.ctx.createImageData(MJE.width, 1);
		imageData.data.set(response.data.data);
		MJE.ctx.putImageData(imageData, 0, response.data.row);
		if(MJE.rows > 0) {
			worker.postMessage({
				amin: MJE.amin,
				amax: MJE.amax,
				bmin: MJE.bmin,
				bmax: MJE.bmax,
				row: --MJE.rows,
				type: MJE.type,
				width: MJE.width,
				height: MJE.height,
				divergesColor1: MJE.divergesColor1,
				divergesColor2: MJE.divergesColor2,
				convergesColor: MJE.convergesColor
			});
		}
	};
}
