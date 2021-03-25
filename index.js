var gameOver = false;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/rsz_battle.jpg";


// top image
var topReady = false;
var topImage = new Image();
topImage.onload = function () {
    topReady = true;
};
topImage.src = "images/bluefiretop.jpg";


// side image
var sideReady = false;
var sideImage = new Image();
sideImage.onload = function () {
    sideReady = true;
};
sideImage.src = "images/bluefireside.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/ash2.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster2.png";

// spider image
var spiderReady = false;
var spiderImage = new Image();
spiderImage.onload = function () {
    spiderReady = true;
};
spiderImage.src = "images/spider1.png";

// death sound
var deathSound = new Audio("sounds/death.mp3");
deathSound.preload = "auto";
deathSound.load();

// win sound
var winSound = new Audio("sounds/win.mp3");
winSound.preload = "auto";
winSound.load();

// Game objects
var hero = {
        speed: 256, // movement in pixels per second
        x: 0,  // where on the canvas are they?
        y: 0  // where on the canvas are they?
    };
    var monster = {
    // for this version, the monster does not move, so just and x and y
        x: 0,
        y: 0
    };

    var spider1 = {
        x: 150,
        y: 320
    };
    var spider2 = {
        x: 450,
        y: 120
    };
    var spider3 = {
        x: 600,
        y: 430
    };
    var spider4 = {
        x: 200,
        y: 550
    };
    var spider5 = {
        x: 350,
        y: 620
    };
    var monstersCaught = 0;

    // Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
  //  console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
   // console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);


// Update game objects
var update = function (modifier) {

    
if (38 in keysDown && hero.y > 25+4) { //  holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (50 + 6)) { //  holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (25+4)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (50 + 6)) { // holding right key
        hero.x += hero.speed * modifier;
    }
        // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;       // keep track of our “score”
    if (monstersCaught > 4)
    {
        winSound.play();
        alert("Congrats, you won!");
        gameOver  = true;
    }
        reset();       // start a new cycle
    }

    if (touchingSpider(hero)){
        deathSound.play();
        alert("You were eaten by a spider")
        gameOver  = true;
        reset();
    }
    };

    

// Draw everything in the main render function
var render = function () {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }
    if (topReady) {
                ctx.drawImage(topImage, 0, 0);
                ctx.drawImage(topImage, 0, 800-25);
            }
        if (sideReady) {
                    ctx.drawImage(sideImage, 0, 0);
                    ctx.drawImage(sideImage, 800-25, 0);
                }
        if (heroReady) {
                ctx.drawImage(heroImage, hero.x, hero.y);
            }
        
            if (monsterReady) {
                ctx.drawImage(monsterImage, monster.x, monster.y);
            }

            if (spiderReady) {
                    ctx.drawImage(spiderImage, spider1.x, spider1.y);
                    ctx.drawImage(spiderImage, spider2.x, spider2.y);
                    ctx.drawImage(spiderImage, spider3.x, spider3.y);
                    ctx.drawImage(spiderImage, spider4.x, spider4.y);
                    ctx.drawImage(spiderImage, spider5.x, spider5.y);

                }
    
            // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
}

// Reset the game when the player catches a monster
var reset = function () {
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;
    
    //Place the monster somewhere on the screen randomly
    // but not in the hedges, Article in wrong, the 64 needs to be 
    // hedge 32 + hedge 32 + char 32 = 96
    //     monster.x = 32 + (Math.random() * (canvas.width - 96));
    //     monster.y = 32 + (Math.random() * (canvas.height - 96));

    let notGood = true;
    while (notGood) {
          monster.x = 32 + (Math.random() * (canvas.width - 96));
          monster.y = 32 + (Math.random() * (canvas.height - 96));

        if (! touchingSpider(monster)){
            notGood = false;
        }
    }

    };

// The main game loop
var main = function () {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        //  Request to do this again ASAP
        requestAnimationFrame(main);
    };

// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.

function touchingSpider(player){
    if (
        (player.x <= (spider1.x + 25)
            && spider1.x <= (player.x + 25)
            && player.y <= (spider1.y + 25)
            && spider1.y <= (player.y + 25)) ||
        (player.x <= (spider2.x + 25)
            && spider2.x <= (player.x + 25)
            && player.y <= (spider2.y + 25)
            && spider2.y <= (player.y + 25)) ||
        (player.x <= (spider3.x + 25)
            && spider3.x <= (player.x + 25)
            && player.y <= (spider3.y + 25)
            && spider3.y <= (player.y + 25)) ||
        (player.x <= (spider4.x + 25)
            && spider4.x <= (player.x + 25)
            && player.y <= (spider4.y + 25)
            && spider4.y <= (player.y + 25)) ||
        (player.x <= (spider5.x + 25)
            && spider5.x <= (player.x + 25)
            && player.y <= (spider5.y + 25)
            && spider5.y <= (player.y + 25))
    )
    return true;



}