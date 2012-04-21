jam.includeModule("RectCollision");
jam.includeModule("ProtoTools");

window.onload = function(){
    initialize();
};

initialize = function(){
    var BOID_COUNT = 20;
    var game = jam.Game(800, 600, document.body);
    var background = jam.Sprite(0, 0);
    background.setImage("assets/test_mask.png");
    background.oldRender = background.render;
    background.center = jam.Vector(0, 0);
    background.update = jam.extend(background.update, function(){
        if(jam.Input.buttonDown("RIGHT")){
	    background.angle += 1;
	}
	if(jam.Input.buttonDown("LEFT")){
	    background.angle -= 1;
	}
    });

    background.render = function(context, camera){
	if(background.image !== null && background.visible){
	    
	    var tx = Math.floor(background.x - camera.scroll.x * background.parallax.x + background.width/2);
	    var ty = Math.floor(background.y - camera.scroll.y * background.parallax.y + background.height/2);
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

    var player = {};
    game.add(background);
    player.x = 50;
    player.y = 50;
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
        player.x = jam.Input.mouse.x;
	player.y = jam.Input.mouse.y;
    });

    for(var i = 0; i < BOID_COUNT + 1; i++){
	makeBoid(i, i);
    }
    game.run();
};