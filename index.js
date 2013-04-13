var mje;

$(document).ready(function() {
	$('#explore_button').on('click', function(e) {
		e.preventDefault();
		$('#start').hide();
		$('#explorer_graph').attr('width', $(window).width());
		$('#explorer_graph').attr('height', $(window).height());
		mje = new Grapher($("#equation").val(), $("#a").val(), $("#b").val(), $('#explorer_graph')[0], $('#explorer_graph')[0].getContext('2d'));
		mje.graph();
		return false;
	});
});

function graph(imgdata, canvas, context) {	
	

}

function Grapher(type, a, b, canvas, ctx) {
	var g = this;
	this.sn = SchemeNumber;
	this.fn = this.sn.fn;
	this.type = type;
	this.a = a;
	this.b = b;
	this.canvas = canvas;
	this.width = this.sn(this.canvas.width.toString());
	this.height = this.sn(this.canvas.height.toString());
	this.context = ctx;
	this.c = function() { return g.sn(g.a+"+"+g.b+"i"); };
	this.z = null;
	this.amin = this.sn("-10");
	this.amax = this.sn("10");
	this.bmin = this.sn("-10");
	this.bmax = this.sn("10");
}

Grapher.prototype.translate = function(x, y) {
	return {
		a: this.fn["+"](
			this.fn["*"](
				this.fn["/"](
					this.fn["-"](
						this.amax,
						this.amin),
					this.width
					),
				x
				),
			this.amin
			),
		b: this.fn["+"](
			this.fn["*"](
				this.fn["/"](
					this.fn["-"](
						this.bmax,
						this.bmin),
					this.height
					),
				this.fn["-"](
					this.height,
					y
					)
				),
			this.bmin
			)
	};
};

Grapher.prototype.getColor = function(point) {
	return [Math.floor(Math.random() * (255 - 0 + 1)) + 0, Math.floor(Math.random() * (255 - 0 + 1)) + 0, Math.floor(Math.random() * (255 - 0 + 1)) + 0];
};

Grapher.prototype.graph = function() {
	var gw = new Worker("graphworker.js");
	gw.addEventListener('message', function(e) {
		this.context.putImageData(e.data, 0,0);
	}, false);
	gw.postMessage({imagedata: this.context.createImageData(this.canvas.width, this.canvas.height), sn: this.sn, getColor: this.getColor, translate: this.translate});
};