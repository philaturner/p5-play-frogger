var GRID_SIZE = 64;
var COLS = 8;
var ROWS = 9;
var MAX_CARS = 6;
var MAX_LOGS_P_ROW = 5;
var MARGIN = 64;
var BASE_LOG_SPEED = 2.5;

var player;
var cars;
var logs;
var flag;
var dead = false;
var won = false;

var roadTile;
var waterTile;
var imgdeath;

var moveCounter = 0;
var score = 0;

function preload(){
  imgdeath = loadImage('assets/frog-death.png');
  imgInWater = loadImage('assets/frog-water.png');
  roadTile = loadImage('assets/raod-tile.png');
  waterTile = loadImage('assets/water-tile.png');
}

function setup(){
  //draw canvas and add to div
  var canvas = createCanvas(ROWS * GRID_SIZE , COLS * GRID_SIZE);
  canvas.parent('canvas-container');

  //define sprit groups
  cars = new Group();
  logs = new Group();

  //setup cars
  for (var i = 0; i < MAX_CARS; i++){
    var ang = 180; //180 left  360 right
    var row = floor(random(2, 5)) * GRID_SIZE;
    var py = height - row;
    var px = floor(random(0, ROWS)) * GRID_SIZE;
    createCar(1, px, py + (GRID_SIZE/2), ang);  //type
  }

  //setup logs for first row
  for (var i = 0; i < MAX_LOGS_P_ROW; i++){
    var ang = 360; //180 left  360 right
    var row = 6 * GRID_SIZE;
    var py = height - row;
    var px = floor(random(0, ROWS)) * (GRID_SIZE*2);
    createLog(1, px, py + (GRID_SIZE/2), ang, BASE_LOG_SPEED);
  }

  //setup logs for second row
  for (var i = 0; i < MAX_LOGS_P_ROW; i++){
    var ang = 360; //180 left  360 right
    var row = 7 * GRID_SIZE;
    var py = height - row;
    var px = floor(random(0, ROWS)) * (GRID_SIZE*2);
    createLog(1, px, py + (GRID_SIZE/2), ang, BASE_LOG_SPEED + 0.5);  //increased log speed for top row
  }

  //setup player
  player = createSprite(width/2, height/2);
  var img  = loadImage("assets/frog.png");
  player.addImage(img);
  player.scale = 1;
  player.position.x = floor(ROWS / 2) * (GRID_SIZE);
  player.position.y = height - (GRID_SIZE/2);

  //flag setup
  flag = createSprite(width/2,height/2);
  var img  = loadImage("assets/flag.png");
  flag.addImage(img);
  flag.scale = 1;
  flag.position.x = floor(ROWS / 2) * (GRID_SIZE);
  flag.position.y = (GRID_SIZE/2);
  flag.setCollider("rectangle", 0, 0, GRID_SIZE/2, GRID_SIZE/2);
}

function draw(){
  background(6,81,1); //dark green

  //instruction text
  fill(255);
  textAlign(CENTER);
  text("Use the arrow keys to move", width-85, 20);


  //death or ending check
  if (dead || won){
    textSize(32);
    fill(200, 0, 0);
    if (dead) text('#RIP - You scored: ' + calcScore(), width/2, height/2-20);
    fill(255, 153, 0);
    if (won) text('#WON - You scored: ' + calcScore(), width/2, height/2-20);
  }

  //draws in road tiles
  for (i = 4; i < 7; i++) {
    for (j = 0; j < COLS + 1; j++){
      image(roadTile, GRID_SIZE*j, GRID_SIZE*i);
    }
  }

  //draws in water tiles
  for (i = 1; i < 3; i++) {
    for (j = 0; j < COLS + 1; j++){
      image(waterTile, GRID_SIZE*j, GRID_SIZE*i);
    }
  }

  //check for sprites offscreen and reposition
  for (var i = 0; i < allSprites.length; i++){
    var s = allSprites[i];
    if(s.position.x < -MARGIN) s.position.x = width + MARGIN;
    if(s.position.x > width + MARGIN) s.position.x = -MARGIN;
    if(s.position.y < -MARGIN) s.position.y = height + MARGIN;
    if(s.position.y > height + MARGIN) s.position.y = -MARGIN;
  }

  //update sprites & draw
  drawSprites();

  //various player collisions
  player.overlap(flag, winner);
  player.collide(cars, collided);
  player.overlap(logs, riding);
  //if not on log and over water tile
  if (!player.overlap(logs) && player.position.y > GRID_SIZE && player.position.y < GRID_SIZE*3){
    inWater();
  }
}

function winner(){
  won = true;
}

function collided(){
  dead = true;
  player.removeImage;
  player.addImage(imgdeath); //update to death image
}

function riding(){
  //set player speed equal to log speed so it appears to be stuck on it
  player.setSpeed(BASE_LOG_SPEED, 360);
}

function inWater(){
  dead = true;
  player.removeImage;
  player.addImage(imgInWater); //update to drown image
}

//TODO should really be an object with logs extending from cars object
function createCar(type, x, y, a){
  var c = createSprite(x, y);
  var img  = loadImage("assets/car.png");  //TODO Use type below to add different images
  c.addImage(img);
  c.setSpeed(3, a);
  c.rotationSpeed = 0;
  c.type = type;

  //TODO Build different car images and sizes? extend to lorry or something ?!?
  if(type == 1)
    c.scale = 1;
  if(type == 2)
    c.scale = .6;
  if(type == 3)
    c.scale = .3;

  c.mass =  2 + c.scale;

  cars.add(c);
  return c;
}

function createLog(type, x, y, a, s){
  var l = createSprite(x, y);
  var img  = loadImage("assets/log.png");  //TODO Use type below to add different images
  l.addImage(img);
  l.setSpeed(s, a);
  l.rotationSpeed = 0;
  l.type = type;

  //TODO Build different log images similar to the cars
  if(type == 1)
    l.scale = 1;
  if(type == 2)
    l.scale = .6;
  if(type == 3)
    l.scale = .3;

  l.mass =  2 + l.scale;

  l.setCollider("rectangle", 0, 0, GRID_SIZE/2, GRID_SIZE/2); //sets the collide bounds of the log
  logs.add(l);
  return l;
}

function keyPressed() {
  if (!dead && !won){ //stops movement if dead
    if(keyCode == UP_ARROW) {
      player.position.y += -GRID_SIZE
      player.setSpeed(0,0);
      moveCounter++;
    } else if (keyCode == DOWN_ARROW) {
      player.position.y += GRID_SIZE
      player.setSpeed(0,0);
      moveCounter++;
    } else if (keyCode == LEFT_ARROW) {
      player.position.x += -GRID_SIZE
      player.setSpeed(0,0);
      moveCounter++;
    } else if (keyCode == RIGHT_ARROW) {
      player.position.x += GRID_SIZE
      player.setSpeed(0,0);
      moveCounter++;
    }
  }
  return 0;
}

function calcScore(){
  var minimumMoves = 7;
  var maxScore = 1000;
  if (dead) return 0
  return floor((minimumMoves/moveCounter)*maxScore) //scaling score based on best possible
}
