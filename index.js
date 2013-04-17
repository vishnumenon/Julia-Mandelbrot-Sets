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
		MJE.canvas = $('#explorer_graph')[0];
		MJE.ctx = MJE.canvas.getContext('2d');
		MJE.canvas.setAttribute('width', MJE.width);
		MJE.canvas.setAttribute('height', MJE.height);
		MJE.type = $('#equation').val();
		$('#start').hide();
		drawGraph();
		return false;
	});
});

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
			width: MJE.width
		});

	}

}

function createCallback(worker) {
	return function(response) {
		console.log(response);
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
				width: MJE.width
			});
		}
	};
}
