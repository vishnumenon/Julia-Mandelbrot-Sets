var mje;

$(document).ready(function() {
	$('#explore_button').on('click', function(e) {
		e.preventDefault();
		$('#start').hide();
		$('#explorer_graph').attr('width', window.innerWidth);
		$('#explorer_graph').attr('height', window.innerHeight);
		mje = new Grapher($("#equation").val(), $("#a").val(), $("#b").val(), $('#explorer_graph')[0], $('#explorer_graph')[0].getContext('2d'));
		setTimeout(mje.graph(), 1);
		return false;
	});
});

function Grapher(type, a, b, canvas, ctx) {
	var g = this;
	this.sn = SchemeNumber;
	this.fn = this.sn.fn;
	this.type = type;
	this.a = a;
	this.b = b;
	this.canvas = canvas;
	this.context = ctx;
	this.c = function() { return g.sn(g.a+"+"+g.b+"i"); };
	this.z = null;
	this.amin = -10;
	this.amax = 10;
	this.bmin = -10;
	this.bmax = 10;
}

Grapher.prototype.translate = function(x, y) {
	return {
		a: ((this.amax - this.amin) / this.canvas.width)  *  x + this.amin,
		b: ((this.bmax - this.bmin) / this.canvas.height) * (this.canvas.height - y) + this.bmin
	};
};

Grapher.prototype.getColor = function(point) {
	return [Math.floor(Math.random() * (255 - 0 + 1)) + 0, Math.floor(Math.random() * (255 - 0 + 1)) + 0, Math.floor(Math.random() * (255 - 0 + 1)) + 0];
};

Grapher.prototype.graph = function() {
	var imagedata = this.context.createImageData(this.canvas.width, this.canvas.height);
	for(var x = 0; x<this.canvas.width; x++) {
		for(var y = 0;  y<this.canvas.height; y++) {
			color  = this.getColor(this.translate(x, y));
			imagedata.data[(y*4*imagedata.width) + x*4] = color[0];
			imagedata.data[(y*4*imagedata.width) + x*4 + 1] = color[1];
			imagedata.data[(y*4*imagedata.width) + x*4 + 2] = color[2];
			imagedata.data[(y*4*imagedata.width) + x*4 + 3] = 255;
		}
	}
	this.context.putImageData(imagedata, 0,0);
};