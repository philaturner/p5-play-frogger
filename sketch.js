var GRID_SIZE = 64;
var COLS = 8;
var ROWS = 9;
var MAX_CARS = 10;
var MARGIN = 32;

var player
var cars
var logs

function setup(){
  var canvas = createCanvas(COLS * GRID_SIZE , ROWS * GRID_SIZE);
  canvas.parent('canvas-container');

  cars = new Group();
  logs = new Group();

  //setup cars
  for (var i = 0; i < MAX_CARS; i++){
    var ang = 180; //180 left  90 right
    var row = floor(random(2, 5)) * GRID_SIZE;
    var py = height - row;
    var px = floor(random(0, ROWS)) * GRID_SIZE;
    createCar(1, px, py, ang);  //type
  }

  //setup player
  player = createSprite(width/2, height/2);
  var img  = loadImage("assets/frog.png");
  player.addImage(img);
  player.scale = .9;
  player.position.x = floor(ROWS / 2) * GRID_SIZE;
  player.position.y = height - GRID_SIZE;
}

function draw(){
  background(61);

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
}

function createCar(type, x, y, a){
  var c = createSprite(x, y);
  var img  = loadImage("assets/car.png");  //TODO Use type below to add different images
  c.addImage(img);
  c.setSpeed(4.5, a);
  c.rotationSpeed = 0;
  c.type = type;

  //TODO Build different car images and sizes? extend to lorry or something ?!?
  if(type == 1)
    c.scale = 0.98;
  if(type == 2)
    c.scale = .6;
  if(type == 3)
    c.scale = .3;

  c.mass =  2 + c.scale;

  //c.setCollider("rectangle", 250, 250, 200, 200); //TODO Potentially use for collision
  cars.add(c);
  return c;

}
