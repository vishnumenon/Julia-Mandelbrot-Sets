var mje;

$(document).ready(function() {
	$('#explore_button').on('click', function(e) {
		e.preventDefault();
		$('#start').hide();
		$('#explorer_graph').attr('width', window.innerWidth);
		$('#explorer_graph').attr('height', window.innerHeight);
		mje = new Grapher($("#equation").val(), $("#a").val(), $("#b").val(), $('#explorer_graph')[0], $('#explorer_graph')[0].getContext('2d'));
		mje.graph();
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
	this.xmin = -10;
	this.xmax = 10;
	this.ymin = -10;
	this.ymax = 10;
}

Grapher.prototype.graph = function() {
	var id = this.context.createImageData(1,1);
	var d  = id.data;
	var color;
	for(var x = 0; x<this.canvas.width; x++) {
		for(var y = 0;  y<this.canvas.height; y++) {
			color  = this.getColor(this.translate(x, y));
			d[0]   = color[0];
			d[1]   = color[1];
			d[2]   = color[2];
			d[3]   = color[3];
			this.context.putImageData( id, x, y );
		}
	}
};

Grapher.prototype.zs = {

};