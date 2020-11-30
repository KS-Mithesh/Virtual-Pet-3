var screen;

var puppy, puppyImage, puppyStanding, puppySitting;
var food, stock;
var database;
var milk, visible=0;
var feedDogButton, addFoodButton;
var lastFed = "Loading...", time = "", realTime;

var dropdown, buttonState = "hidden";
var takeRest, checkStock, playTime, goHome, walkingTime, checkVaccineChart, bathingTime;

var game;
var nothing;

var bedRoom, black, foodStocks, garden, injection, lazyPuppy, livingRoom, park, puppyLeft, puppyRight, vaccineChart, washRoom;

var z=0, zState="false";

function preload() {
  puppyStanding = loadAnimation("images/dogStanding.png");
  puppySitting  = loadAnimation("images/dogSitting.png");
  lazyPuppy = loadImage("images/lazy.png");

  puppyLeft = loadAnimation("images/runningLeft.png");
  puppyRight = loadAnimation("images/runningRight.png");
 
  milk = loadImage("images/milk.png");
  injection = loadImage("images/injection.png");
  vaccineChart = loadImage("images/vaccinationChart.png");
  foodStocks = loadImage("images/foodStock.png");

  bedRoom = loadImage("images/bedRoom.png");
  garden = loadImage("images/garden.png");
  livingRoom = loadImage("images/livingRoom.png");
  washRoom = loadImage("images/washRoom.png");

}

getTime();

function setup() {
  database = firebase.database();

  createCanvas(850, 600);

  screen = createSprite(0,0,850*2,600*2);
  screen.visible=false;

  game = new Game();
  
  puppy = createSprite(750,300,10,10);
  puppy.addAnimation("standing puppy", puppyStanding);
  puppy.addAnimation("sitting puppy", puppySitting);
  puppy.scale=0.3;

  feedDogButton = new Button("Feed The Dog",800,70,function(){
    if(food>0 && visible<=0 && game.state==="null") {
      database.ref("food").set(food-1);
      visible = 255;
      puppy.changeAnimation("sitting puppy",puppySitting);
      puppy.x = 745;
      puppy.y = 320;
      if(realTime <12 && (realTime>=0||realTime==00)) { 
        time = "AM";
        var lastFeded = (realTime-1)+1;
        if(lastFeded===0||lastFeded===00) {
          lastFeded = 12;
        }
        database.ref('lastFed').set(lastFeded+" "+time);
      }
      else if(realTime >=12 && realTime<24) {
        time = "PM";
        var lastFeded = realTime-12;
        database.ref('lastFed').set(lastFeded+" "+time);
      }
    }
    takeRest.button.hide();
      checkStock.button.hide();
      playTime.button.hide();
      goHome.button.hide();
      checkVaccineChart.button.hide();
      bathingTime.button.hide();

      buttonState="hidden";
  });
  addFoodButton = new Button("Add Food",905,70,function(){
    if(food<20 && visible<=0 && game.state==="null") {
      database.ref("food").set(food+1);
    }
      takeRest.button.hide();
      checkStock.button.hide();
      playTime.button.hide();
      goHome.button.hide();
      checkVaccineChart.button.hide();
      bathingTime.button.hide();

      buttonState="hidden";
  });

  dropdown = new Button("More 🔻",1050,70,function(){

    if(buttonState==="hidden" && visible<=0 && game.state==="null") {

      takeRest = new Button("Take Rest",1050,100,function() {
        game.changeState("takeRest");
      });takeRest.display();

      checkStock = new Button("Check Stock",1050,121,function() {
        game.changeState("checkStock");
      });checkStock.display();

      playTime = new Button("Play Time",1050,142,function() {
        game.changeState("playTime");
      });playTime.display();

      goHome = new Button("Go Home",1050,163,function() {
        game.changeState("goHome");
      });goHome.display();

      checkVaccineChart = new Button("Vaccine Chart",1050,184,function() {
        game.changeState("checkVaccineChart");
      });checkVaccineChart.display();

      bathingTime = new Button("Bathing Time",1050,205,function() {
        game.changeState("bathingTime");
      });bathingTime.display();

      buttonState="shown";
    }
    else if(buttonState==="shown") {

      takeRest.button.hide();
      checkStock.button.hide();
      playTime.button.hide();
      goHome.button.hide();
      checkVaccineChart.button.hide();
      bathingTime.button.hide();

      buttonState="hidden";
    }

  });

  var foodStock=database.ref('food');
  foodStock.on("value",readStock);

    var timing=database.ref('lastFed');
    timing.on("value",(data)=>{
      var times = data.val();
      lastFed = times;
    });

}

function draw() {  
  background(46,139,87);

  if(zState==="true") {
  z+=1;
  }

  visible-=3;

  milkBottles(food);

  if(visible<0) {
    puppy.changeAnimation("standing puppy",puppyStanding);
    puppy.x = 750;
    puppy.y = 300;
  }

  feedDogButton.display();
  addFoodButton.display();
  dropdown.display();

  drawSprites();

  textSize(30);fill(255,255,255);text("Last Fed: "+lastFed+" ",100,60);

  if(game.state!=="null") {

    if(game.state==="takeRest") {
      hide();
      imageMode(CENTER);
      image(bedRoom,425,321,730,555);
      mouse();
    }
    else if(game.state==="checkStock") {
      hide();
      rectMode(CENTER);fill("white");
      rect(425,321,750,550);
      imageMode(CENTER);
      image(foodStocks,425,321,730,555);
      mouse();
    }
    else if(game.state==="playTime") {
      hide();
      imageMode(CENTER);
      image(garden,425,321,730,555);
      mouse();
    }
    else if(game.state==="goHome") {
      hide();
      imageMode(CENTER);
      image(livingRoom,425,345,700,600);
      mouse();
    }
    else if(game.state==="checkVaccineChart") {
      hide();
      imageMode(CENTER);
      image(vaccineChart,425,320,700,550);
      mouse();
    }
    else if(game.state==="bathingTime") {
      hide();
      imageMode(CENTER);
      image(washRoom,425,345,700,600);
      mouse();
    }

}

  tint(255,visible);imageMode(CENTER);
  image(milk,600,320,210,210);
}

function readStock(data) {
  stock = data.val();
  food = stock;
}

async function getTime(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  realTime = hour;
}
