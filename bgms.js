var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,640,480);
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(20,20,600,440);
var pcXpos = 0;
var pcYpos = 0;  

function drawScreen() {
    drawRed(pcXpos, pcYpos, ctx);
}

function drawRed(pcXpos, pcYpos, ctx) {
    ctx.fillStyle="#CC3333";
    ctx.fillRect(pcXpos * 40 + 20, pcYpos * 40 + 20, 40, 40);   
}

$(document).keypress(function(e) {
    if (e.which == 119) { pcYpos--; }
    if (e.which == 115) { pcYpos++; }
    if (e.which == 97) { pxXpos--; }
    if (e.which == 100) {pcXpos++; }
});

setInvterval(drawScreen, 1000);

function f() {
  alert('Hi');
}
setTimeout(f, 1000);
