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
    var hex = new Hex(hexPos.x, hexPos.y, this.hexSize, this.snap, this, q, r);
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

HexGrid.prototype.at = function (q, r) {
    return this.hexes[q + ',' + r];
}

HexGrid.prototype.neighboursFor = function (q, r) {
    var neighborCoordinates = [
       [+1,  0], [+1, -1], [ 0, -1],
       [-1,  0], [-1, +1], [ 0, +1]
    ];

    var requester = this.at(q, r);
    var neighbours = [];

    neighborCoordinates.forEach(function (coordinates) {
        var q = requester.q + coordinates[0];
        var r = requester.r + coordinates[1];

        var neighbour = this.at(q, r);
        if (neighbour) neighbours.push(neighbour)
    }, this);

    return neighbours;
}

function Hex (x, y, size, snap, grid, q, r) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.snap = snap;
    this.grid = grid;
    this.q = q;
    this.r = r;

    this.corners = [];
    var xi, yi;
    for (var i = 0; i < 6; i++) {
        var angle = 2 * Math.PI / 6 * i;
        xi = this.x + this.size * Math.cos(angle);
        yi = this.y + this.size * Math.sin(angle);
        this.corners.push(xi);
        this.corners.push(yi);
    }
}

Hex.prototype.draw = function () {
    this.el = this.snap.polygon(this.corners).attr('class', 'hexagon');
    this.el.mouseover(this.activateNeighbours.bind(this));
    this.el.mouseout(this.deactivateNeighbours.bind(this));
}

Hex.prototype.activateNeighbours = function () {
    this.el.attr('fill', '#aaa')
    var neighbours = this.grid.neighboursFor(this.q, this.r);
    neighbours.forEach(function (hex) {
        hex.el.attr('fill', '#ccc')
    })
}

Hex.prototype.deactivateNeighbours = function () {
    this.el.attr('fill', '#efefef')
    var neighbours = this.grid.neighboursFor(this.q, this.r);
    neighbours.forEach(function (hex) {
        hex.el.attr('fill', '#efefef')
    })
}
