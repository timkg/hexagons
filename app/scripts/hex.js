function HexGrid (x0, y0, hexSize, size, snap) {
    this.x0 = x0;
    this.y0 = y0;
    this.hexSize = hexSize;
    this.hexes = {};
    this.snap = snap;

    for (var q = -size; q <= size; q++) {
        for (var r = -size; r <= size; r++) {
            var z = -q-r;
            if (Math.abs(q) <= size && Math.abs(r) <= size && Math.abs(z) <= size) {
                this.addHex(q, r);
            }
        }
    }
}

HexGrid.prototype.addHex = function (q, r) {
    var hexPos = this.position(q, r);
    var hex = new Hex(hexPos.x, hexPos.y, this.hexSize, this.snap, this);
    this.hexes[q + ',' + r] = hex;
    hex.draw();
};

HexGrid.prototype.position = function (q, r) {
    var deltaX, deltaY;

    deltaX = this.hexSize * 3/2 * q;
    deltaY = this.hexSize * Math.sqrt(3) * (r + q/2);

    return {
        x: this.x0 + deltaX,
        y: this.y0 + deltaY
    };
}

function Hex (x, y, size, snap, grid) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.snap = snap;
    this.grid = grid;
}

Hex.prototype.draw = function () {
    var points = [], xi, yi;
    for (var i = 0; i < 6; i++) {
        var angle = 2 * Math.PI / 6 * i;
        xi = this.x + this.size * Math.cos(angle);
        yi = this.y + this.size * Math.sin(angle);
        points.push(xi);
        points.push(yi);
    }

    this.snap.polygon(points).attr('class', 'hexagon');
}