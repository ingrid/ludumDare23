jam.includeModule("ArcadeInput");
jam.includeModule("RectCollision");
jam.includeModule("ProtoTools");

window.onload = function(){
    initialize();
};

initialize = function(){
    var BOID_COUNT = 10;
    var PLAYER_SPEED = 80;
    var FRICTION = 0.15;
    var game = jam.Game(800, 600, document.body);
    var background = jam.Sprite(0, 0);
    background.setImage("assets/test_mask.png");
    background.center = jam.Vector(0, 0);
    background.update = jam.extend(background.update, function(){
        if(jam.Input.buttonDown("A")){
	    background.angle += 1;
	}
	if(jam.Input.buttonDown("D")){
	    background.angle -= 1;
	}
    });

    background.render = function(context, camera){
	if(background.image !== null && background.visible){
	    
	    //	    var tx = Math.floor(background.x - camera.scroll.x * background.parallax.x + background.width/2);
	    //	    var ty = Math.floor(background.y - camera.scroll.y * background.parallax.y + background.height/2);
	    var tx = -Math.floor(camera.scroll.x + jam.Game._canvas.width/2);
	    var ty = -Math.floor(camera.scroll.y + jam.Game._canvas.height/2);
	    context.save();
	    
	    context.translate(tx, ty);
	    if(background.angle != 0){ context.rotate(background.angle * Math.PI / 180); }
	    if(background.alpha != 1.0){ context.globalAlpha = background.alpha; }
	    if(background.facing == jam.Sprite.LEFT){ context.scale(-1, 1);}
		
	    context.drawImage(background.image, 0, 0, background.width, background.height, -background.width/2, -background.height/2, background.width, background.height);
		
	    context.restore();
	    if(mask === undefined){
		context.drawImage(background.image, 0, 0);
		mask = context.getImageData(0, 0, 1200, 1200);
		console.log(mask.data);
	    }
   
	}
    };

    game.add(background);

    var player = jam.Sprite(50, 50);
    player.rectangleImage(20, 20, "rgb(255, 0, 0)");
    game.add(player);
    game.camera.follow = player;
    player.boids = [];
    var makeBoid = function(x, y){
	var boid = jam.Sprite(x, y);
	boid.rectangleImage(5, 5, "rgb(200, 200, 200)");
	boid.velocity.x = 0;
	boid.velocity.y = 0;
	boid.update = jam.extend(boid.update, function(elapsed){
	    if(mask != undefined){
		//		var pixel = mask.data[Math.floor(boid.x + boid.velocity.x)][Math.floor(boid.y + boid.velocity.y)];
	    }
       
	    var co = jam.Vector();
	    var se = jam.Vector();
	    var al = jam.Vector();
	    boid.velocity.x = 0;
	    boid.velocity.y = 0;

	    co.x = player.x - boid.x;
	    co.y = player.y - boid.y;
	    for(var i = 0; i < player.boids.length; i++){
		b = player.boids[i];
		if(b != boid){
		    if(Math.pow(b.x - boid.x, 2) + Math.pow(b.y - boid.y, 2) < 100){
			se = jam.Vector.sub(se, jam.Vector.sub(b.velocity, boid.velocity));
			al = jam.Vector.add(al, b.velocity);
		    }
		}
	    }
	    boid.velocity = jam.Vector.add(boid.velocity, co);
	    boid.velocity = jam.Vector.add(boid.velocity, se);
	});
	player.boids.push(boid);
	
	game.add(boid);
    };

    var mask = undefined;

    game.update = jam.extend(game.update, function(elapsed){
	    player.accel = jam.Vector.mul(jam.Input.joy, PLAYER_SPEED);
        player.accel = jam.Vector.sub(player.accel, jam.Vector.mul(player.velocity, FRICTION));
        player.velocity = jam.Vector.add(player.velocity, player.accel);
    });

    for(var i = 0; i < BOID_COUNT + 1; i++){
	    makeBoid(i, i);
    }
    game.run();
};
