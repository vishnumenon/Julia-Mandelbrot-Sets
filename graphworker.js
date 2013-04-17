self.addEventListener('message', function(request) {
	var g = 255;
	var row = request.data.row;
	var data = [];
	for(var i = 3; i < request.data.width * 4; i +=4) {
		data[i] = 255;
	}
	for(var i = 1 + Math.round(Math.random()); i < request.data.width * 4; i +=4) {
		data[i] = g;
	}

	postMessage({data: data, row: row});

});