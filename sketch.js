const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var board1, board2;
var numberOfArrows = 10;
var yes = true;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, 500, 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  playerBase.display();
  player.display();
  playerArcher.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      if (board1Collision.collided || board2Collision.collided) {
        console.log("Collided");
      }

      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          playerArrows[i].trajectory = [];
        }
      }
    }
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  // Arrow Count
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  if(yes == true){
  text("Remaining Arrows : " + numberOfArrows, 200, 100);
  }
  if(numberOfArrows==0){
    yes = false;
    text("ALL OUT OF ARROWS",180,100);

  }
}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}
