const midpoint = () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const width = 800;
    const height = 550;

    const bgRgba = [240,240,200,255];
    const pointRgba = [0,0,255,255];
    const lineRgba = [0,0,0,255];
    const vlineRgba = [255,0,0,255];

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    function Painter(context, width, height) {
        this.context = context;
        this.imageData = context.createImageData(width, height);
        this.points = [];
        this.now = [-1,-1];
        this.width = width;
        this.height = height;
        this.getPixelIndex = (x, y) => {
            if(x < 0 || y < 0 || x >= this.width || y >= this.height)
                return -1;
            return (y * this.width + x) << 2;
        };
        this.setPixel = (x, y, rgba) => {
            const pixelIndex = this.getPixelIndex(x, y);
            if(pixelIndex == -1){
                return;
            }
            for(var i = 0; i < 4; i++){
                this.imageData.data[pixelIndex + i] = rgba[i];
            }
        }
        this.drawPoint = (p, rgba) => {
            var x = p[0];
            var y = p[1];
            for (var i = -1; i <= 1; i++){
                for(var j = -1; j <= 1; j++){
                    this.setPixel(x + i, y + j, rgba);
                }
            }
        }
        // Midpoint line algorithm
        this.drawLine = (center, radius, rgba) => {
            var x0 = center[0];
            var y0 = center[1];
            var x = radius;
            var y = 0;
            var decisionOver2 = 1 - x;
        
            while (y <= x) {
                this.setPixel(x + x0, y + y0, rgba);
                this.setPixel(y + x0, x + y0, rgba);
                this.setPixel(-x + x0, y + y0, rgba);
                this.setPixel(-y + x0, x + y0, rgba);
                this.setPixel(-x + x0, -y + y0, rgba);
                this.setPixel(-y + x0, -x + y0, rgba);
                this.setPixel(x + x0, -y + y0, rgba);
                this.setPixel(y + x0, -x + y0, rgba);
        
                y++;
                if (decisionOver2 <= 0) {
                    decisionOver2 += 2 * y + 1;
                } else {
                    x--;
                    decisionOver2 += 2 * (y - x) + 1;
                }
            }
        }
        
        this.update = () => {
            context.putImageData(this.imageData, 0, 0);
        }
    }
    const painter = new Painter(context, width, height);

    //Các hàm xử lý sự kiện chuột và bàn phím
    getPosOnCanvas = function(x, y){
    var bbox = canvas.getBoundingClientRect();
    return [Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
                Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5)];
    }

    handleMouseMove = (e) => {
        var pos = getPosOnCanvas(e.clientX, e.clientY);
    painter.update();
    }

    let startPoint = null;

    handleMouseDown = (e) => {
        const pos = getPosOnCanvas(e.clientX, e.clientY);
        painter.drawPoint(pos, pointRgba); // Draw the first point
        painter.update(); // Update the canvas
        if(startPoint == null){
            startPoint = pos;
        }
        else{
            //Draw a second point
            painter.drawPoint(startPoint, pointRgba);
            // Draw the line
            painter.drawLine(startPoint, Math.floor(Math.sqrt((pos[0] - startPoint[0]) ** 2 + (pos[1] - startPoint[1]) ** 2)), lineRgba);
            startPoint = null; // Reset the start point
            painter.update(); // Update the canvas
        }
    }

    canvas.addEventListener('mousedown', handleMouseDown);

    // Button Event
    document.getElementById('reset').addEventListener('click', () => {
        painter.context.clearRect(0, 0, width, height);
        painter.imageData = painter.context.createImageData(width, height);
        painter.points = [];
        painter.update();
    })

}

document.getElementById('midpoint').addEventListener('click', () => {
    document.querySelector('h1').innerText = 'Midpoint Circle Algorithm';
    midpoint();
})


