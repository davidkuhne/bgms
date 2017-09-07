$( document ).ready(function() {

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0,0,640,480);

debug = {
    on: 0,
    what: 0,
    where: 0,
    counter: 0,
    color: "#666666",
    show: function() {
        if (debug.on == 1) {
            ctx.fillStyle=debug.color;
            ctx.fillText(debug.what, debug.where*10+50, 50);
        }
    }
};

//Initialize timing
var counter = 0;
var seconds = 0;
var frames = 0;
var fps = 60;

//Canvas and frame settings
var frame = { x: 640, y: 480 };
var tile = { x: 40, y: 40 };
var canvasWidth = Math.floor(frame.x/tile.x);
var canvasHeight = Math.floor(frame.y/tile.y);
c.width = canvasWidth * tile.x;
c.height = canvasHeight * tile.y;

//Initialize grid
var gridWidth = 24;
var gridHeight = 24;
var areaWidth = tile.x * gridWidth;
var areaHeight = tile.y * gridHeight;

var grid = [0];
var gridRow = [0];
for (x = 1; x < gridWidth; x++) { grid [grid.length] = [0]; }
for (y = 1; y < gridHeight; y++) { gridRow [gridRow.length] = [0]; }

for (x = 0; x < gridWidth; x++) {
    grid[x] = [gridRow];
    for (y = 0; y < gridHeight; y++) {
        if (x == 0 || x == gridWidth - 1 || y == 0 || y == gridHeight - 1) {
            grid[x][y] = { type: 2, damage: 0, agent: -1 };
        } else {
            var type = Math.floor(Math.random() * 1.2);
            if (type == 0) { makeGrass(x, y); }
            else if (type == 1) { makeStone(x, y); }
        }
    }
}

function makeGrass(x, y) {
    var grass = Math.floor(Math.random() * 5);
    grid[x][y] = { type: 0, damage: 0, agent: -1, grass: grass};
}
function makeStone(x, y) {
    var grass = Math.floor(Math.random() * 5);
    grid[x][y] = { type: 1, damage: 0, agent: -1, grass: grass};
}

stone = ["#000000", "#222222", "#444444", "#666666", "#888888"];
grass = ["#33FF33", "#66FF33", "#00CC00", "#33CC00", "#66CC33"];
colors = ["#CC33CC", "#CCCC33", "#33CC33", "#33CCCC", "#3333CC"];

//Variable and methods for camera operation
var camera = {
    x: 0,
    y: 0,
    center: function() {
        if (agent[0].xPos < camera.x + frame.x / 4 && camera.x > 0) {
            camera.x = agent[0].xPos - frame.x / 4;
        } else if (agent[0].xPos > camera.x + (frame.x - frame.x / 4) && camera.x < areaWidth - frame.x) {
            camera.x = agent[0].xPos - frame.x + frame.x / 4;
        } else if (agent[0].yPos < camera.y + frame.y / 4 && camera.y > 0) {
            camera.y = agent[0].yPos - frame.y / 4;
        } else if (agent[0].yPos > camera.y + (frame.y - frame.y / 4) && camera.y < areaHeight - frame.y) {
            camera.y = agent[0].yPos - frame.y + frame.y / 4;
        }
        if (camera.x < 0) { camera.x = 0; }
        if (camera.x > areaWidth - frame.x) { camera.x = areaWidth - frame.x; }
        if (camera.y < 0) { camera.y = 0; }
        if (camera.y > areaHeight - frame.y) { camera.y = areaHeight - frame.y; }  //157   640-480 = 160
        
        /*ctx.fillStyle = "#000000"; ctx.fillText(x + " " + y, 50, 50);*/
    }
};

//Initialize graphics?
var b64Images = {
    moose: ["data:image/  png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAuElEQVRYw+2Xyw2AIAyGgTiAd4dyVofy7gb1ZKKYyrOxLe2NBEj78feBBwDH2YJjbtN9cezbA+e8rL7kstbz8glSWw1hWQTjiHIjptCeLIJUBHrcy56gB4BXpFSmlyCmmT+I6aqDWFZe+7D1UNMMqQZ7aJg9wYB53rOfjjcP5mqxNXtzzuucqGN9lpIsqaM6CaYiTxEq6UCyOknuZGydRNIT666Dtb+2VNbbE5uD5qA5yK0XG8EPOwH+a4bGOv6V3wAAAABJRU5ErkJggg==",
        "data:image/  png; base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAtUlEQVRYw+2YMQ6AIAxFKfEA7h7Ks3ood29QJwYJpIECaWu7EAdJee3vRwERg+SIQXhsIzZ57utThv04YdT7NghyCXkPUpGIJtJprZFuqYgNgvkJZ/VkaV/xBKHHSfKTzgq7BGcTteck3LlYezbhJICIy1RpsgejFGK1vtSt4lx9XDX3zFGdBKk51nr74VRCJ0GKHEW4l7w7Cccx1BL0BJfMwdavN0r1XmJP0BP0BK39Wfg1wRewbYdB+/IWnAAAAABJRU5ErkJggg=="]
};

//Initialize agents
var agents = 5;
var agent = [0];
for (x = 1; x < agents; x++) {
    agent[x] = [0];
}
agent[0] = {
    body: 3,
    grace: 3,
    mind: 3,
    soul: 3,
    speed: 5,
    width: tile.x,
    height: tile.y,
    xPos: tile.x,
    yPos: tile.y,
    xMove: 0,
    yMove: 0,
    timer: 0,
    face: 1,
    imageFace: 1,
    color: "#CC3333",
    faceColor: "#CCCCCC",
    image: [new Image(), new Image()]
};
for (n = 0; n < agent[0].image.length; n++) {
    agent[0].image[n].src = b64Images.moose[n];
}
for (x = 1; x < agents; x++) {
    var X = Math.floor(Math.random() * (gridWidth - 2) + 1) * tile.x;
    var Y = Math.floor(Math.random() * (gridHeight - 2) + 1) * tile.y;
    agent[x] = {
        body: 3,
        grace: 3,
        mind: 3,
        soul: 3,
        speed: 5,
        width: tile.x,
        height: tile.y,
        xPos: X,
        yPos: Y,
        xMove: 0,
        yMove: 0,
        face: 0,
        imageFace: 0,
        lost: 0,
        timer: 0,
        delay: Math.floor(Math.random() * 10 + 20),
        color: colors[Math.floor(Math.random() * 5)],
        faceColor: "#CCCCCC",
        image: [new Image(), new Image()],
        setTimer: function () { this.timer = this.delay }
    };
}
for (m = 1; m < agent.length; m++) {
    for (n = 0; n < agent[m].image.length; n++) {
        agent[m].image[n].src = b64Images.moose[n];
    }
}

function setFace(who) {
    dir = agent[who].face;
    if (agent[who].image.length == 2 && dir > 1)
        agent[who].imageFace = dir - 2;
}

//Empty grid spaces that start with agents
for (x = 0; x < agent.length; x++) {
    grid[Math.floor(agent[x].xPos / tile.x)][Math.floor(agent[x].yPos / tile.y)].type = 0;
}

//Run timer
setInterval(runFrame, 1000 / fps);

//Process one frame
function runFrame() {
    //Increment timer
    if (frames == fps) { frames = 0; seconds++; }
    frames++;

    animateAgents();
    drawFrame();
    
    //Display some sort of debug
    debug.what = "Lost: " + agent[1].lost + "   xPos: " + agent[1].xPos + "   yPos: " + agent[1].yPos +
            "   Counter: " + debug.counter + "   xMove: " + agent[1].xMove + "   yMove: " + agent[1].yMove;
    debug.show();
}

//
function animateAgents() {
    
    //Animate agents
    for (who = 0; who < agent.length; who++) {
        var x = agent[who].xPos;
        var y = agent[who].yPos;
        
        //If NPC is centered in column, stop horizontal movement
        if (who > 0 && x % tile.x == 0 && agent[who].face > 1) {
            agent[who].xMove = 0; }
        
        //If NPC is centered in row, stop horizontal movement
        if (who > 0 && y % tile.y == 0 && agent[who].face < 2) {
            agent[who].yMove = 0; }
        
        //if NPC is in tile center and timer is empty, assign random direction and set timer
        if (who > 0 && x % tile.x == 0 && y % tile.y == 0 && agent[who].timer == 0) {
            agent[who].face = Math.floor(Math.random() * 4);
            if (agent[who].face == 0) { agent[who].yMove = -1; }
            else if (agent[who].face == 1) { agent[who].yMove = 1; }
            else if (agent[who].face == 2) { agent[who].xMove = -1; setFace(who); }
            else if (agent[who].face == 3) { agent[who].xMove = 1; setFace(who); }
            agent[who].setTimer(); }
            //agent[who].timer = agent[who].delay; }
        //Otherwise, if timer is positive, decrement timer
        else if (agent[who].timer > 0) {
            agent[who].timer--; }
        
        //If NPC is not set to move, is out of tile center, and timer is empty, assign directions
        if (who > 0 && agent[who].timer == 0 && ((agent[who].xMove == 0 && agent[who].yMove == 0 
         && (x % tile.x != 0 || y % tile.y != 0)) || (blocked(who, "x") == 1 && agent[who].xMove != 0)
         || (blocked(who, "y") == 1 && agent[who].yMove != 0))) {
            if (x % tile.x != 0) { agent[who].xMove *= -1; agent[who].face += agent[who].xMove; setFace(who); }
            if (y % tile.y != 0) { agent[who].yMove *= -1; agent[who].face += agent[who].yMove; }
            if (agent[who].xMove == 0 && agent[who].yMove == 0) {
                agent[who].xMove = (Math.floor(Math.random() * 2) - 0.5) * 2;
                agent[who].yMove = (Math.floor(Math.random() * 2) - 0.5) * 2;
                var two = [(agent[who].xMove * -1) / 2 + 2.5, (agent[who].yMove * -1) / 2 + 0.5];
                agent[who].face = two[Math.floor(Math.random() * 2)]; }
            agent[who].setTimer();
        }
        
        //Move agent; executes once per speed point
        for (n = 0; n < agent[who].speed; n++) {
            var xMoved = 0; var yMoved = 0;
            
            //If agent is set to move horizontally and is not blocked, do so and remember it; if agent is still centered, halt horizontal movement
            if (agent[who].xMove != 0) {
                if (blocked(who, "x") == 0) { agent[who].xPos += agent[who].xMove; xMoved = 1; }
                if (who > 0 && agent[who].xPos % tile.x == 0) { agent[who].xMove = 0; debug.counter++;} }
            
            // If agent is set to move vertically and is not blocked, do so and remember it; if agent is still centered, halt vertical movement
            if (agent[who].yMove != 0) {
                if (blocked(who, "y") == 0) { agent[who].yPos += agent[who].yMove; yMoved = 1; }
                if (who > 0 && agent[who].yPos % tile.y == 0) { agent[who].yMove = 0; debug.counter++;} }
            
            //Recalibrate position tracking variables after potential movement
            var x = agent[who].xPos; var y = agent[who].yPos;
            
            //If agent is lost, set to move down and/or right
            if (agent[who].lost == 1) {
                if (x % tile.x != 0) { agent[who].xMove *= -1; }
                if (y % tile.y != 0) { agent[who].yMove *= -1; }
                if (agent[who].xMove == 0 && agent[who].yMove == 0) {
                    agent[who].xMove = (Math.floor(Math.random() * 2) - 0.5) * 2;
                    agent[who].yMove = (Math.floor(Math.random() * 2) - 0.5) * 2; }
                agent[who].lost = 0;
            }
            
            //If the agent is set to lost but centered in tile, unset lost
            if (agent[who].lost == 1 && agent[who].xPos % tile.x == 0 && agent[who].yPos % tile.y == 0) {
                agent[who].lost = 0; }
            
            //If agent moved both directions, apply diagonal slow penalty
            if (xMoved == 1 && yMoved == 1) { n += 0.41; }
        }
    }
}

function drawFrame() {
    //Refresh white center
    ctx.clearRect(0,0,640,480);

    //Move camera if necessary based on player movement
    camera.center();

    //Protects against errors from camera/draw past limits
    var safeWidth = canvasWidth;
    var safeHeight = canvasHeight;
    if (canvasWidth + camera.x / tile.x == gridWidth) { safeWidth--; }
    if (canvasHeight + camera.y / tile.y == gridHeight) { safeHeight--; }
    
    //Per column, per row, draw appropriate background square
    for (x = Math.floor(camera.x / tile.x); x <= safeWidth + camera.x / tile.x; x++) {
        for (y = Math.floor(camera.y / tile.y); y <= safeHeight + camera.y / tile.y; y++) {
            if (grid[x][y].type == 0) {
                ctx.fillStyle = grass[grid[x][y].grass];
                ctx.fillRect(x * tile.x - camera.x, y * tile.y - camera.y, tile.x, tile.y);
            }
            if (grid[x][y].type == 1) {
                ctx.fillStyle="#000000";
                if (grid[x][y].damage > 0) { ctx.fillStyle = stone[grid[x][y].damage]; }
                ctx.fillRect(x * tile.x - camera.x, y * tile.y - camera.y, tile.x, tile.y);
            }
            if (grid[x][y].type == 2) {
                ctx.fillStyle="#442200";
                ctx.fillRect(x * tile.x - camera.x, y * tile.y - camera.y, tile.x, tile.y);
                ctx.fillStyle="#663300";
                ctx.fillRect(x * tile.x - camera.x + 1, y * tile.y - camera.y + 1, tile.x - 2, tile.y - 2);
            }
        }
    }
    
    //Draw the agents
    for (x = 0; x < agent.length; x++) {
        if (agent[x].image == "none") {
        ctx.fillStyle="#333333";
        ctx.fillRect(agent[x].xPos - camera.x, agent[x].yPos - camera.y, tile.x, tile.y);
        ctx.fillStyle=agent[x].color;
        ctx.fillRect(agent[x].xPos - camera.x + 1, agent[x].yPos - camera.y + 1, tile.x - 2, tile.y - 2);
        drawFace(x); }
        else { ctx.drawImage(agent[x].image[agent[x].imageFace], agent[x].xPos - camera.x, agent[x].yPos - camera.y, tile.x, tile.y); }
    }
}

var keyboard = {
    w: 0,
    a: 0,
    s: 0,
    d: 0,
    space: 0
};

//Watch for keys getting pressed down
$(document).keydown(function(e) {
    if (e.which == 87) {
        keyboard.w = 1;
        if (agent[0].xMove == 0) { agent[0].face = 0; }
        agent[0].yMove = -1; agent[0].timer = -1; } //W
    
    if (e.which == 83) {
        keyboard.s = 1;
        if (agent[0].xMove == 0) { agent[0].face = 1; }
        agent[0].yMove = 1; agent[0].timer = -1; } //S
    
    if (e.which == 65) {
        keyboard.a = 1;
        if (agent[0].yMove == 0 || agent[0].image.length == 2) { agent[0].face = 2; setFace(0); }
        agent[0].xMove = -1; agent[0].timer = -1; } //A
    
    if (e.which == 68) {
        keyboard.d = 1;
        if (agent[0].yMove == 0 || agent[0].image.length == 2) { agent[0].face = 3; setFace(0); }
        agent[0].xMove = 1; agent[0].timer = -1; } //D
    
    if (e.which == 32) {
        keyboard.space = 1;
        strike(0); }                               //Space bar
    //ctx.fillStyle="#000000";
    //ctx.fillText(e.which, 50, 50);  //Debug feature to report a key being pressed down
});

//Watch for keys being released
$(document).keyup(function(e) {
    if (e.which == 87) { keyboard.w = 0; agent[0].yMove = keyboard.s; } //W
    if (e.which == 83) { keyboard.s = 0; agent[0].yMove = 0 - keyboard.w; } //S
    if (e.which == 65) { keyboard.a = 0; agent[0].xMove = keyboard.d; } //A
    if (e.which == 68) { keyboard.d = 0; agent[0].xMove = 0 - keyboard.a; } //D
    if (e.which == 32) { keyboard.space = 0; }
    if (agent[0].xMove != 0) { agent[0].face = agent[0].xMove / 2 + 2.5; }
    if (agent[0].yMove != 0) { agent[0].face = agent[0].yMove / 2 + 0.5; }
});

//Draw the line indicating facing
function drawFace(who) {
    var a = Math.floor(tile.x / 4);  //Start of line
    var b = tile.x - a;              //End of line
    var c = Math.floor(tile.x / 8);  //Distance from close edge
    var d = tile.x - c;              //Distance from far edge
    var x = camera.x;                //Camera x offset
    var y = camera.y;                //Camera y offset
    var xMult = agent[who].xPos; var yMult = agent[who].yPos;
    ctx.fillStyle = agent[who].faceColor;
    ctx.beginPath();
    var face = agent[who].face;
    if (face == 0) { ctx.moveTo(xMult + a - x, yMult + c - y);
        ctx.lineTo(xMult + b - x, yMult + c - y); }
    else if (face == 1) { ctx.moveTo(xMult + a - x, yMult + d - y);
        ctx.lineTo(xMult + b - x, yMult + d - y); }
    else if (face == 2) { ctx.moveTo(xMult + c - x, yMult + a - y);
        ctx.lineTo(xMult + c - x, yMult + b - y); }
    else if (face == 3) { ctx.moveTo(xMult + d - x, yMult + a - y);
        ctx.lineTo(xMult + d - x, yMult + b - y); }
    ctx.stroke();
}

//Check to see if a proposed movement is blocked (per pixel)
function blocked(who, axis) {
    var xl = Math.floor((agent[who].xPos - 1) / tile.x);
    var xr = Math.floor(agent[who].xPos / tile.x);
    var yu = Math.floor((agent[who].yPos - 1) / tile.y);
    var yd = Math.floor(agent[who].yPos / tile.y);
    var xM = agent[who].xMove;
    var yM = agent[who].yMove;
    if (agent[who].xPos % tile.x == 0) {
        var x2 = xr;
    } else { var x2 = xr+1; }
    if (agent[who].yPos % tile.y == 0) {
        var y2 = yd;
    } else { var y2 = yd+1; }
    var isBlocked = 0;
    if (axis == "x") {
        if (xM == -1) {
            isBlocked += grid[xl][yd].type != 0 || grid[xl][y2].type != 0;
        }
        if (xM == 1) {
            isBlocked += grid[xr+1][yd].type != 0 || grid[xr+1][y2].type != 0;
        }
        for (x = 0; x < agent.length; x++) {
            if (x == who) continue;
            isBlocked += (agent[x].xPos - agent[who].xPos) * xM == tile.x && Math.abs(agent[x].yPos - agent[who].yPos) < tile.y;
        }
        return isBlocked;
    }
    if (axis == "y") {
        if (yM == -1) {
             isBlocked += grid[xr][yu].type != 0 || grid[x2][yu].type != 0;
        }
        if (yM == 1) {
             isBlocked += grid[xr][yd+1].type != 0 || grid[x2][yd+1].type != 0;
        }
        for (x = 0; x < agent.length; x++) {
            if (x == who) continue;
            isBlocked += (agent[x].yPos - agent[who].yPos) * yM == tile.y && Math.abs(agent[x].xPos - agent[who].xPos) < tile.x;
        }
        return isBlocked;
    }
    return 1;
}

//PC strikes a rock by pressing space bar
function strike(who) {
    a = Math.round(agent[0].xPos / tile.x);
    b = Math.round(agent[0].yPos / tile.y);
    if (agent[0].face == 0) { b--; }
    else if (agent[0].face == 1) { b++; }
    else if (agent[0].face == 2) { a--; }
    else if (agent[0].face == 3) { a++; }

    if (grid[a][b].type == 1) { grid[a][b].damage++; }
    if (grid[a][b].damage == 5) {
        grid[a][b].type = 0;
        grid[a][b].damage = 0;
    }
}






});
