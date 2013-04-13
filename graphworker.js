self.addEventListener('message', function(e){
	var id = e.data.imagedata;
	var mje = e.data;
	for(var x = 0; x<id.width; x++) {
		for(var y = 0;  y<id.height; y++) {
			color  = mje.getColor(mje.translate(mje.sn(x.toString()), mje.sn(y.toString())));
			id.data[(y*4*id.width) + x*4] = color[0];
			id.data[(y*4*id.width) + x*4 + 1] = color[1];
			id.data[(y*4*id.width) + x*4 + 2] = color[2];
			id.data[(y*4*id.width) + x*4 + 3] = 255;
		}
	}
	postMessage(id);
}, false);