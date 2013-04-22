function Complex(a, b) {
	this.a = a;
	this.b = b;
}

Complex.prototype.plus =  function(c) {
	return new Complex(this.a + c.a, this.b + c.b);
};

Complex.prototype.squared = function() {
	return new Complex(this.a*this.a - this.b*this.b, this.a*this.b + this.a*this.b);
};

Complex.prototype.abs = function() {
	return Math.sqrt(this.a*this.a + this.b*this.b);
};

function getA(x, min, max, width) {
	return (x * ((max - min) / width)) + min;
}

function getB(y, min, max, height) {
	return ((height - y) * ((max - min)/height)) + min;
}

function getColor(c, dc, cc, d2l, type, jc) {
	var z;
	if(type == 'mandelbrot') {
		z = new Complex(0,0);
	} else {
		z = c;
		c = jc;
	}

	var counter = 0;
	while(z.abs() < 2 && counter <= 50) {
		if(counter === 50) {
			return cc;
		}
		z = (z.squared()).plus(c);
		counter++;
	}
	return [dc[0] + (counter / 50) * (d2l ? 200 : -200),
		dc[1] + (counter / 50) * (d2l ? 200 : -200),
		dc[2] + (counter / 50) * (d2l ? 200 : -200),
		255];
}







self.addEventListener('message', function(request) {
	var row = request.data.row;
	var data = [];
	var color;
	for(var i = 0; i < request.data.width; i++) {
		color = getColor(new Complex(
			getA(i, request.data.amin, request.data.amax, request.data.width),
			getB(row, request.data.bmin, request.data.bmax, request.data.height)),
			request.data.divergesColor,
			request.data.convergesColor,
			request.data.darkToLight,
			request.data.type,
			new Complex(request.data.ca, request.data.cb));
		data[4*i] = color[0];
		data[4*i+1] = color[1];
		data[4*i+2] = color[2];
		data[4*i+3] = color[3];
	}
	postMessage({data: data, row: row});

});