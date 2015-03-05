module.exports = geoPieceRing;

function geoPieceRing(options) {

  var geo = {
    positions: [],
    cells: []
  };

  options = options || {};
  options.cellSize = options.cellSize || 3;
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.z = options.z || 0;
  options.radius = options.radius || 200;
  options.pieceSize = options.pieceSize || Math.PI * 0.15;
  options.startRadian = options.startRadian || 0;
  options.numPieces = options.numPieces || 8;
  options.quadsPerPiece = options.quadsPerPiece || 5;
  options.height = options.height || 10;
  options.drawOutline = options.drawOutline === undefined ? true : options.drawOutline;
  
  createGeometry(options, geo.positions, geo.cells);

  return geo;
}

function createGeometry(options, positions, cells) {

  var o = options;
  var pos = positions;
  var y = o.y;
  var halfHeight = o.height * 0.5;
  var radius = o.radius;
  var pieceSize = o.pieceSize;
  var numPieces = o.numPieces;
  var quadsPP = o.quadsPerPiece;
  var startRadian = o.startRadian;
  var radInc = (2 * Math.PI - ( numPieces * pieceSize )) / numPieces;
  var quadRadInc = pieceSize / quadsPP;
  var curRad = 0; 
  var sIdx = 0;
  var x, z, x2, z2, r1, r2;

  for(var i = 0; i < numPieces; i++) {

    for(var j = 0; j < quadsPP; j++) {

      r1 = curRad + quadRadInc * j + startRadian;
      r2 = curRad + quadRadInc * (j + 1) + startRadian;

      x = Math.cos(r1) * radius + o.x;
      z = Math.sin(r1) * radius + o.z;
      x2 = Math.cos(r2) * radius + o.x;
      z2 = Math.sin(r2) * radius + o.z;

      pos.push([ x, y - halfHeight, z ]);
      pos.push([ x, y + halfHeight, z ]);
      pos.push([ x2, y + halfHeight, z2 ]);
      pos.push([ x2, y - halfHeight, z2 ]);
      
      //add in the cells
      if(o.cellSize == 1) {

        cells.push([ sIdx ]);
        cells.push([ sIdx + 1 ]);
        cells.push([ sIdx + 2 ]);
        cells.push([ sIdx + 3 ]);
      } else if(o.cellSize == 2) {

        // vertical lines
        if( !o.drawOutline ) {

          cells.push([ sIdx, sIdx + 1 ]);
          cells.push([ sIdx + 2, sIdx + 3 ]);
        } else if( j == 0 ) {

          cells.push([ sIdx, sIdx + 1 ]);
        } else if( j == quadsPP - 1 ) {

          cells.push([ sIdx + 2, sIdx + 3 ]);
        }
        
        // horizontal lines
        cells.push([ sIdx + 1, sIdx + 2 ]);
        cells.push([ sIdx + 3, sIdx ]);
      } else if(o.cellSize == 3) {

        cells.push([ sIdx, sIdx + 1, sIdx + 2 ]);
        cells.push([ sIdx, sIdx + 3, sIdx + 2 ]);
      }

      sIdx += 4;
    }

    curRad += radInc + pieceSize;
  }
}