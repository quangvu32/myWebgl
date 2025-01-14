

const dda = () => {
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
        this.drawLine = (p0, p1, rgba) => {
            var x0 = p0[0], y0 = p0[1];
            var x1 = p1[0], y1 = p1[1];
            var dx = x1 - x0, dy = y1 - y0;
            if (dx == 0 && dy == 0){
                return;
            }
            if (Math.abs(dy) <= Math.abs(dx)){
                if(x1 < x0){
                    var tx = x0; x0 = x1; x1 = tx;
                    var ty = y0; y0 = y1; y1 = ty;
                }
                var k = dy / dx;
                var y = y0;
                for(var x = x0; x <= x1; x++){
                    this.setPixel(x, Math.floor(y + 0.5), rgba);
                    y += k;
                }
            }
            else{
                if(y1 < y0){
                    var tx = x0; x0 = x1; x1 = tx;
                    var ty = y0; y0 = y1; y1 = ty;
                }
                var k = dx / dy;
                var x = x0;
                for(var y = y0; y <= y1; y++){
                    this.setPixel(Math.floor(x + 0.5), y, rgba);
                    x += k;
                }
            }
        }
        this.update = () => {
            context.putImageData(this.imageData, 0, 0);
        }
    }
    const painter = new Painter(context, width, height);

    //Mode 1: Draw Point
    getPosOnCanvas = function(x, y){
    var bbox = canvas.getBoundingClientRect();
    return [Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
                Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5)];
    }

    const handleMouseMove = (e) => {
        var pos = getPosOnCanvas(e.clientX, e.clientY);
        painter.update();
    }

    let startPoint = null;

    const handleMouseDown = (e) => {
        const pos = getPosOnCanvas(e.clientX, e.clientY);
        painter.drawPoint(pos, pointRgba); // Draw the first point
        painter.update(); // Update the canvas
        if (startPoint === null) {
            startPoint = pos;
        } else {
            painter.drawPoint(pos, pointRgba); // Draw the second point
            painter.drawLine(startPoint, pos, lineRgba) // Draw a line between the two points
            startPoint = null; // Reset the start point for next line
            painter.update(); // Update the canvas
        }
    }

    //Mode 2: Draw Line
     // Array to store line segments
     const lineSegments = [];

     // Function to draw all line segments
    const drawAllLines = () => {
         context.clearRect(0, 0, width, height);
         lineSegments.forEach(segment => {
             painter.drawLine(segment.startX, segment.startY, segment.endX, segment.endY);
         });
     }
 
    const handleMouseDown_line = (e) => {
        const startX = e.offsetX;
        const startY = e.offsetY;
        // Event listener for mouse move
        function handleMouseMove_line(event) {
            drawAllLines(); // Redraw all previous lines
            const endX = event.offsetX;
            const endY = event.offsetY;
            painter.drawLine(startX, startY, endX, endY); // Draw the new line
        }

        // Add mousemove event listener
        canvas.addEventListener('mousemove', handleMouseMove_line);
        // Event Listener for Mouse Up (to complete the line)
        canvas.addEventListener('mouseup', function onMouseUp(event) {
            canvas.removeEventListener('mousemove', handleMouseMove_line); // Remove the temporary mousemove listener
            canvas.removeEventListener('mouseup', onMouseUp); // Remove the temporary mouseup listener

            // Store the line segment in the array
            const endX = event.offsetX;
            const endY = event.offsetY;
            lineSegments.push({ startX, startY, endX, endY });
        }); 
        drawAllLines();
    }
    var choice = document.querySelector('.drawBtn').querySelector('h3').innerText;

    if(choice === 'Draw mode'){
        canvas.removeEventListener('mousedown', handleMouseDown_line);
        canvas.addEventListener('mousedown', handleMouseDown);
    }
    else{
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousedown', handleMouseDown_line);
    }
    
    // Button Event
    document.getElementById('reset').addEventListener('click', () => {
        painter.context.clearRect(0, 0, width, height);
        painter.imageData = painter.context.createImageData(width, height);
        painter.points = [];
        painter.update();
    })
}

document.getElementById('dda').addEventListener('click', () => {
    document.querySelector('h1').innerText = 'DDA Algorithm';
    dda();
})

dda();

