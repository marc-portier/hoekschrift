;
(function($) {
    var SIZE = 30;
    var D0 = SIZE * 0.2;
    var DL = SIZE - D0;
    var DM = SIZE /2;
    
    function encrypt($cnv, txt) {
        var lines = wrappit(txt, $cnv.width());
        var gc = $cnv.get(0).getContext("2d");
        gc.clearRect( 0, 0, $cnv.width(), $cnv.height());
        gc.lineWidth = 3;
        gc.lineCap = "square";
        for (var r = 0; r < lines.length; r++) {
            var line = lines[r];
            for (var c = 0; c < line.length; c++) {
                drawChar(gc, c*SIZE, r*2*SIZE, line.charAt(c));
            }
        }
    }
    
    
    function wrappit (src, w) {
        w = w || 80 * SIZE;
        var positions = Math.floor(w/SIZE);
        var tgt = new Array();
        var line = "";
        var words = src.split(' ');
        for(var i = 0; i < words.length; i++) {
            word = words[i];
            var wordlines = word.split('\n');
            for (var j=0; j < wordlines.length; j++) {
                var part = wordlines[j];
                if (line.length + part.length  < positions) {
                    line += (line.length ? " " : "") + part;
                } else {
                    if (line.length)  tgt[tgt.length] = line;
                    line = part;
                }
                
                if (j+1 < wordlines.length) {
                    if (line.length)  tgt[tgt.length] = line;
                    line = "";
                }
            }
        }

        if (line.length)  tgt[tgt.length] = line;
        return tgt;
    }
    
    var ACODE = "a".charCodeAt(0);
    
    function drawChar(gc, x, y, t) {
        t = t.toLowerCase();
        var code = t.charCodeAt(0) - ACODE;
        if (code < 0 || code > 25) return; // just leave blank
        
        gc.save();
        try {
            gc.translate(x,y);
            drawCode(gc, code);
        } finally {
            gc.restore();
        }
    }
    
    function drawCode(gc, code) {
        if (code < 18) {
            var dot = Math.floor(code /9);
            code = code %9
            drawHash(gc, code, dot);
        } else {
            code = code -18;
            var dot = Math.floor(code /4);
            code = code % 4;
            drawIeks(gc, code, dot);
        }
    }
    
    function drawHash(gc, code, dot){
        var r = Math.floor(code /3);
        var c = code %3;
        
        gc.beginPath();
            gc.moveTo(D0,D0);
            r==0 ? gc.moveTo(DL,D0) : gc.lineTo(DL,D0);
            c==2 ? gc.moveTo(DL,DL) : gc.lineTo(DL,DL);
            r==2 ? gc.moveTo(D0,DL) : gc.lineTo(D0,DL);
            c==0 ? gc.moveTo(D0,D0) : gc.lineTo(D0,D0);
            gc.moveTo(DM,DM);
            if (dot)  gc.arc(DM, DM, 1, 0, Math.PI *2, true);
        gc.stroke();
    }
    
    var IEKS = [
        [{x:D0,y:D0}, {x:DM,y:DL}, {x:DL,y:D0}, {x:DM,y:D0}],
        [{x:D0,y:D0}, {x:DL,y:DM}, {x:D0,y:DL}, {x:D0,y:DM}],
        [{x:DL,y:D0}, {x:D0,y:DM}, {x:DL,y:DL}, {x:DL,y:DM}],
        [{x:D0,y:DL}, {x:DM,y:D0}, {x:DL,y:DL}, {x:DM,y:DL}]
    ];
    
    function drawIeks(gc, code, dot){
        var ieks = IEKS[code];
        gc.beginPath();
            gc.moveTo( ieks[0].x, ieks[0].y);
            gc.lineTo( ieks[1].x, ieks[1].y);
            gc.lineTo( ieks[2].x, ieks[2].y);
            gc.moveTo( ieks[3].x, ieks[3].y);
            if (dot)  gc.arc(ieks[3].x, ieks[3].y, 1, 0, Math.PI *2, true);            
        gc.stroke();
    }

    
    $.extend({"hoekschrift": encrypt});
})(jQuery);
