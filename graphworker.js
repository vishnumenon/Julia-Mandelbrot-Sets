importScripts('assets/biginteger.js', 'assets/schemeNumber.js');

function Grapher(type, a, b, width, height) {
	this.sn = SchemeNumber;
	this.fn = this.sn.fn;
	this.type = type;
	this.a = a;
	this.b = b;
	this.width = this.sn(width.toString());
	this.height = this.sn(height.toString());
	this.c = this.sn(this.a+"+"+this.b+"i");
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


self.addEventListener('message', function(e){
	var mje = new Grapher(e.data.type, e.data.a, e.data.b, e.data.width, e.data.height);
	var buf8 = new Uint8ClampedArray(new ArrayBuffer(e.data.end - e.data.start));
	var startY = e.data.start / e.data.width ;
	var startX = e.data.start - (startY - e.data.width);
	var endY = e.data.end / e.data.width;
	var endX = e.data.end - (endY - e.data.width);
	for(var x = startX; x <= endX; x++) {
		for(var y = startY; y <= endY; y++) {
			var index = ((y * 4 * e.data.width) + x * 4);
			color  = mje.getColor(mje.translate(mje.sn(x.toString()), mje.sn(y.toString())));
			buf8[index] = color[0];
			buf8[++index] = color[1];
			buf8[++index] = color[2];
			buf8[++index] = 255;
		}
	}
	postMessage({data: buf8, start: e.data.start});
}, false);