var GRID_SIZE = 64;
var COLS = 8;
var ROWS = 9;
var MAX_CARS = 6;
var MAX_LOGS = 6;
var MARGIN = 64;

var player;
var imgdeath;
var cars;
var logs;
var dead = false;

var roadTile;
var waterTile;

function preload(){
  imgdeath = loadImage('assets/frog-death.png');
  roadTile = loadImage('assets/raod-tile.png');
  waterTile = loadImage('assets/water-tile.png');
}

function setup(){
  var canvas = createCanvas(ROWS * GRID_SIZE , COLS * GRID_SIZE);
  canvas.parent('canvas-container');

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

  //setup logs
  for (var i = 0; i < MAX_LOGS; i++){
    var ang = 360; //180 left  360 right
    var row = floor(random(6, 8)) * GRID_SIZE;
    var py = height - row;
    var px = floor(random(0, ROWS)) * (GRID_SIZE*2);
    createLog(1, px, py + (GRID_SIZE/2), ang);  //type
  }

  //setup player
  player = createSprite(width/2, height/2);
  var img  = loadImage("assets/frog.png");
  player.addImage(img);
  player.scale = 1;
  player.position.x = floor(ROWS / 2) * (GRID_SIZE);
  player.position.y = height - (GRID_SIZE/2);
}

function draw(){
  background(6,81,1); //dark green

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
  player.collide(cars, collided);
  player.overlap(logs, riding);
}

function collided(){
  dead = true;
  player.removeImage;
  player.addImage(imgdeath);
}

function riding(){
  console.log('Touched log');
  player.setSpeed(2, 360);
}

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

  //c.setCollider("rectangle", 0, 0, 0, 0); //TODO Potentially use for collision
  cars.add(c);
  return c;
}

function createLog(type, x, y, a){
  var l = createSprite(x, y);
  var img  = loadImage("assets/log.png");  //TODO Use type below to add different images
  l.addImage(img);
  l.setSpeed(2, a);
  l.rotationSpeed = 0;
  l.type = type;

  //TODO Build different car images and sizes? extend to lorry or something ?!?
  if(type == 1)
    l.scale = 1;
  if(type == 2)
    l.scale = .6;
  if(type == 3)
    l.scale = .3;

  l.mass =  2 + l.scale;

  l.setCollider("rectangle", 0, 0, GRID_SIZE/2, GRID_SIZE/2); //Sets the collide bounds of the log
  logs.add(l);
  return l;
}

function keyPressed() {
  if (!dead){ //stops movement if dead
    if(keyCode == UP_ARROW) {
      player.position.y += -GRID_SIZE
      player.setSpeed(0,0);
    } else if (keyCode == DOWN_ARROW) {
      player.position.y += GRID_SIZE
      player.setSpeed(0,0);
    } else if (keyCode == LEFT_ARROW) {
      player.position.x += -GRID_SIZE
      player.setSpeed(0,0);
    } else if (keyCode == RIGHT_ARROW) {
      player.position.x += GRID_SIZE
      player.setSpeed(0,0);
    }
  }
  return 0;
}
