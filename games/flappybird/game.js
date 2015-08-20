var canvas,
	ctx,
	width,
	height,

	fgpos = 0,

	frames = 0,
	score = 0,
	best = 0,

	currentstate = 0,

	states = {
		Splash: 0, Game: 1, Score: 2
	},

	okbtn,

	bird = {

		x: 60,
		y: 100,
		frame: 0,
		animation: [0, 1, 2, 1],
		rotation: 0,
		radius: 12,
		gravity: 0.25,
		jumpHeight: 4.6,

		jump: function() {
			if(this.y >= 600){
				this.jumpHeight = 0;
			}
			this.velocity = -this.jumpHeight;
		},

		update: function(){
			var n = currentstate === states.Splash ? 10 : 5;
			this.frame += frames % n === 0 ? 1 : 0;
			this.frame %= this.animation.length;

			if (currentstate === states.Splash){
				this.y = height - 280 + 5*Math.cos(frames/10);
				this.rotation = 0;
			} else {
				this.velocity += this.gravity;
				this.y += this.velocity;

				if(this.y >= height - s_fg.height-10){
					this.y = height -s_fg.height-10;
					if (currentstate === states.Game){
						currentstate = states.Score;
					}
					this.velocity = this.jumpHeight;
				}

				if (this.velocity >= this.jumpHeight){
					this.frame = 1;
					this.rotation = Math.min(Math.PI/2, this.rotation + 0.2);
					if (this.rotation <= 6.7){
						this.rotation = 6.7;
					}
				} else {
					this.rotation = -0.3;
				}
			}

		},

		draw: function(ctx){
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);

			var n = this.animation[this.frame];
			s_bird[n].draw(ctx, -s_bird[n].width/2, -s_bird[n].height/2);
			ctx.restore();
		}
	},

	pipes = {
		pipesList: [],

		reset: function() {
			this.pipesList = [];
		},

		update: function(){
			if (frames % 100 === 0) {
				var ypos = height - (s_pipeSouth.height+s_fg.height+120+200*Math.random());
				this.pipesList.push({
					x: 500,
					y: ypos,
					width: s_pipeSouth.width,
					height: s_pipeSouth.height
				});
			}
			for (var i = 0, len = this.pipesList.length; i < len; i++) {
				var p = this.pipesList[i];

				if (i === 0){

					score += p.x === bird.x ? 1 : 0;

					var cx = Math.min(Math.max(bird.x, p.x), p.x+p.width);
					var cy1 = Math.min(Math.max(bird.y, p.y), p.y+p.height);
					var cy2 = Math.min(Math.max(bird.y, p.y+p.height+100), p.y+2*p.height+100);

					var dx = bird.x - cx;
					var dy1 = bird.y - cy1;
					var dy2 = bird.y - cy2; // Deltas

					var d1 = dx*dx + dy1*dy1;
					var d2 = dx*dx + dy2*dy2;

					var r = bird.radius*bird.radius;

					if(r > d1 || r > d2){
						currentstate = states.Score;
					}
				}

				p.x -= 2;

				if (p.x < -50){
					this.pipesList.splice(i, 1);
					i--;
					len--;
				}
			}
		},

		draw: function(ctx){
			for (var i = 0, len = this.pipesList.length; i < len; i++){
				var p = this.pipesList[i];
				s_pipeSouth.draw(ctx, p.x, p.y);
				s_pipeNorth.draw(ctx, p.x, p.y+100+p.height);
			}
		}

	};


	function onpress(evt){

		switch (currentstate){
			case states.Splash:
				currentstate = states.Game;
				bird.jump();
				break;
			case states.Game:
				bird.jump();
				break;
			case states.Score:
				var mx = evt.offsetX, my = evt.offsetY;
				if(okbtn.x < mx && mx < okbtn.x + okbtn.width && 
					okbtn.y < my && my < okbtn.y + okbtn.height){
					pipes.reset();
					currentstate = states.Splash;
					score = 0;
				}
				break;

		}
	}

function main() {
	canvas = document.createElement("canvas");
	width = window.innerWidth;
	height = window.innerHeight;

	var evt = "touchstart";
	if (width >= 500) {
		width = 320;
		height = 480;
		canvas.style.border = "1px solid black";
		evt = "mousedown";
	} 

	document.addEventListener(evt, onpress);

	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");

	document.body.appendChild(canvas);

	var img = new Image();
	img.onload = function(){
		initSprites(this);
		ctx.fillStyle = s_bg.color;

		okbtn = {
			x: (width - s_buttons.Ok.width)/2,
			y: (height - 200),
			width: s_buttons.Ok.width,
			height: s_buttons.Ok.height
		}

		run();
	};
	img.src = "sheet.png";
}

function run() {
	var loop = function(){
		update();
		render();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

function update() {
	frames++;

	if(currentstate !== states.Score){
		fgpos = (fgpos - 2)%14;
	} else {
		best = Math.max(best, score);
	}

	if (currentstate === states.Game){
		pipes.update();
	}

	bird.update();
}

function render() {
	ctx.fillRect(0, 0, width, height);
	s_bg.draw(ctx, 0, height - s_bg.height);
	s_bg.draw(ctx, s_bg.width, height - s_bg.height);

	bird.draw(ctx);
	pipes.draw(ctx);

	s_fg.draw(ctx, fgpos, height - s_fg.height);
	s_fg.draw(ctx, fgpos+s_fg.width, height - s_fg.height);

	var width2 = width/2;

	if (currentstate === states.Splash){
		s_splash.draw(ctx, width2 - s_splash.width/2, height-300);
		s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width/2, height-380)
	}

	if(currentstate === states.Score){
		s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width/2, height-400);
		s_score.draw(ctx, width2 - s_score.width/2, height-340);
		s_buttons.Ok.draw(ctx, okbtn.x, okbtn.y);

		s_numberS.draw(ctx, width2-47, height-304, score, null, 10);
		s_numberS.draw(ctx, width2-47, height-264, best, null, 10);
	} else {
		s_numberB.draw(ctx, null, 20, score, width2);
	}
}
main();