var PLAY = 1;
var END = 0;
var gameState = PLAY;

//adding the boy and ground sprites
var boy, boy1I, boy2I,boy3I,boy4I,boy5I,boy6I;
var ground, invisibleGround, groundImage;

//adding the cloud and obstacles sprites
var cloudsGroup, cloudImage ; 
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//making the score
var score=0;

//adding the gameOver and restart images
var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  //loading the the background  animations
  backgroundImg = loadImage("Background.png");
 
  //loading boy animations
  boy1I= loadAnimation("boy animation 1.png","boy animation 2.png","boy animation 3.png","boy animation 4.png","boy animation 5.png","boy animation 6.png" );

  //loading the ground images
  groundImage = loadImage("ground2.png");
  
  //loading the cloud image
  cloudImage = loadImage("QE0IBY 2.png");

  
  //loading the obstacles
  obstacle1 = loadImage("A1.png");
  obstacle2 = loadImage("A2.png");
  obstacle3 = loadImage("A3.png");
  obstacle4 = loadImage("A4.png");
  obstacle5 = loadImage("A5.png");
  obstacle6 = loadImage("A6.png");
  
  //loading the gameOver and restart images
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  //creating the background
  createCanvas(600, 200);
   
  //boy
  boy = createSprite(50,180,20,50);
  boy.addAnimation("running", boy1I);
  //boy.addAnimation("collided", boy_collided);
  boy.scale = 0.3;
  
  //GROUND
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //GAMEOVER IMAGE
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //RESTART IMAGE
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  //size of gameOver and restart image
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  boy.setCollider("rectangle",0,0,boy.width,boy.height);
  boy.debug = false;             
  
  score = 0;

}

function draw() {
  //boy.debug = true;
  background(backgroundImg);
  text("Score: "+ score, 500,50);
  
  //increasing the spped
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
   console.log(boy.y);
    if(keyDown("space") && boy.y >= 145) {
      boy.velocityY = -12;
    
    }
  
    boy.velocityY = boy.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    boy.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(boy)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true; 
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 180 === 0) {
    var cloud = createSprite(600,120,40,10);
    
    cloud.y = Math.round(random(80,120));


    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  boy.changeAnimation("running",boy_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}


