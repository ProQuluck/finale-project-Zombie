var solo, solo2;
var floor, floorImage;
var player, playerImage;
var zombie1Animation;
var revolver, revolverImage;
var amo, amoImage;
var maquina,maqinaImage;
let system;
var zombieGroup, balasGroup;
var bum;

var vidaMaquina = 100;
var balas = 100;


function preload(){
  floorImage = loadImage("./assets/fundo.png");
  zombie1Animation1 = loadAnimation("./assets/zombieN1.png","./assets/zombieN2.png","./assets/zombieN3.png","./assets/zombieN4.png");
  zombie1Animation2 = loadAnimation("./assets/farmer1.png","./assets/farmer2.png","./assets/farmer3.png","./assets/farmer4.png");
  zombie1Animation3 = loadAnimation("./assets/B1.png","./assets/B2.png","./assets/B3.png","./assets/B4.png");
  zombie1Animation4 = loadAnimation("./assets/F1.png","./assets/F2.png","./assets/F3.png","./assets/F4.png");
  zombie1Animation5 = loadAnimation("./assets/tm1.png","./assets/tm2.png","./assets/tm3.png","./assets/tm4.png");
  bum = loadImage("./assets/buum.png");
  revolverImage = loadImage("./assets/revolver.png");
  amoImage = loadImage("./assets/amo.png");
  playerImage = loadImage("./assets/PD.png");
  maquinaImage = loadImage("./assets/maquina.png");
}


function setup(){
  createCanvas(1500,650);


  floor = createSprite(width/2,height/2);
  floor.addImage(floorImage);
  system = new ParticleSystem(createVector(100,height-300));


  player = createSprite(200,height-100,30,100);
  player.shapeColor = "black"
  player.addImage(playerImage);
  player.scale = 0.3;


  revolver = createSprite(player.x+50, player.y-60);
  revolver.addImage(revolverImage);
  revolver.scale = 0.1


  maquina = createSprite(100,height-200);
  maquina.addImage(maquinaImage);
  maquina.scale = 0.5;
 
  solo = createSprite(width/2,height-98,1500,10);
  solo2 = createSprite(width/2,height-137,1500,10);


  solo.visible = false;
  solo2.visible = false;


  zombieGroup = new Group();
  balasGroup = new Group();
}


function draw() {
  background("light_blue");


  if(player.x <20){
    player.x = 20;
  }
  if(revolver.x <60){
    revolver.x = 60;
  }
 
  if(player.x >width-90){
   player.x = width-90;
  }
  if(revolver.x >width-50){
    revolver.x = width-50;
  }


  if (keyWentDown("up_arrow") && player.y >= 300 ){
    player.velocityY = -10;
  }
  if (keyWentDown("up_arrow") && revolver.y >= 300 ){
    revolver.velocityY = -10;
  }
  player.velocityY = player.velocityY + 0.5;
  revolver.velocityY = revolver.velocityY + 0.5;
 
  /*
  if (keyDown("up_arrow")){
    player.y = player.y -5;
    revolver.y = revolver.y -5;
  }
  if (keyDown("down_arrow")){
    player.y = player.y +5;
    revolver.y = revolver.y +5;
  }
  */
 
  if (keyDown("left_arrow")){
    player.x = player.x -5;
    revolver.x = revolver.x -5;
  }


  if (keyDown("right_arrow")){
    player.x = player.x +5;
    revolver.x = revolver.x +5;
  }


  player.collide(solo);
  revolver.collide(solo2);


  if(keyWentDown("SPACE")){
    amo = createSprite(revolver.x+30, revolver.y-10);
    amo.addImage(amoImage);
    amo.scale = 0.02;
    amo.velocityX = 40;
    balasGroup.add(amo);
  }


  for(var i = 0; i < balasGroup.length; i++) {
    if(balasGroup[i].isTouching(zombieGroup)) {
      zombieHit();
      balasGroup[i].destroy();
    }
  }
 
  if(zombieGroup.isTouching(maquina)){
    vidaMaquina = vidaMaquina-5
  }

  if(vidaMaquina < 0){
    maquina.addImage(bum);
  }

  spawnZombiesEasy();
  drawSprites();      
 
  system.addParticle();
  system.run();

  textSize(20);
  text(" Vida Maquina: " +  vidaMaquina, 50, 50);


}


function spawnZombiesEasy() {
  if (frameCount % 60 === 0){
    var x = Math.round(random(550,1500));
    var y = Math.round(random(height -130,height-160));
    var zombie = createSprite(x,y,20,20);
    var rand = Math.round(random(1,5));
    zombie.debug= false;
    switch(rand) {
      case 1: zombie.addAnimation("zombie",zombie1Animation1);
              break;
      case 2: zombie.addAnimation("zombie",zombie1Animation2);
              break;
      case 3: zombie.addAnimation("zombie",zombie1Animation3);
              break;
      case 4: zombie.addAnimation("zombie",zombie1Animation4);
              break;
      case 5: zombie.addAnimation("zombie",zombie1Animation5);
              break;
      default: break;
    }
    zombie.velocityX = Math.round(random(-1,-4));
    zombie.scale = 0.3;
    zombieGroup.add(zombie);
  }
}


function zombieHit() {
  for(var i = 0; i < zombieGroup.length; i++) {
    if(zombieGroup[i].isTouching(balasGroup)) {
      zombieGroup[i].destroy();
    }
  }
}


// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
};


Particle.prototype.run = function() {
  this.update();
  this.display();
};


// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};


// Method to display
Particle.prototype.display = function() {
  stroke(1, this.lifespan);
  strokeWeight(2);
  //fill(200, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
  fill(255,0,0);
  //ellipse(20,20,16,16);
};


// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};


let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};


ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};


ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};


