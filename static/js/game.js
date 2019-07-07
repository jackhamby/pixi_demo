// Class for client-side game object
class Game extends PIXI.Application {
    constructor() {
        super({
            width: 256,
            height: 256
        });
        // this.knights = [];
        this.state = {};
        this.knights = {};
        this.playerKnight = null;
        this.playerId = null;

    }

    init() {
        PIXI.loader
            .add("/static/images/knight.png")
            .load(this.setup.bind(this));

    }


    gameLoop(delta) {
        for (let id in this.knights) {
            let knight = this.knights[id];
            knight.x += knight.vx;
            knight.y += knight.vy;
            let knightHitsWall = this.contain(knight, {
                x: 0,
                y: 0,
                width: this.screen.width,
                height: this.screen.height
            });
            if (knight.vy <= 0) {
                knight.vy += 3;
            }
		}
		this.webSocket.send(this.getState());
		// console.log(this.getState())
        this.renderer.render(this.stage);
    }


    launch() {
        console.log('started');

        let context = this;
        // Start game loop
        this.ticker.add(delta => context.gameLoop(delta));

        // Attach keyboard handlers
        let left = this.keyboard("a"),
            right = this.keyboard("d"),
            down = this.keyboard("s"),
            space = this.keyboard(" ");

        space.press = () => {
            context.playerKnight.vy = -15;
        }

        down.press = () => {
            context.playerKnight.vy = 2;

        };
        down.release = () => {
            context.playerKnight.vy = 0;
        };

        right.press = () => {
            context.playerKnight.vx = 2;

        };
        right.release = () => {
            context.playerKnight.vx = 0;
        };

        left.press = () => {
            context.playerKnight.vx = -2;

        };

        left.release = () => {
            context.playerKnight.vx = 0;
        };
    }

    setup() {
        // Append pixi view 
        let context = this;
        document.body.append(this.view)

        // Create socket connection
        this.webSocket = new WebSocket("ws://localhost:80");

        // On open connection
        this.webSocket.onopen = function () {
            console.log('opened connection');
		};
		
        // Log errors
        this.webSocket.onerror = function (error) {
            console.log('WebSocket Error ' + error);
            console.log(error);
        };

		// Handle messages
        this.webSocket.onmessage = function (event) {
            let state = JSON.parse(event.data);
            if ("init" in state) {
                context.playerId = state["init"];
                context.update(state["state"]);
                context.launch();
            } else {
                context.update(state);
            }
		};
		
		// Handle close
		window.onbeforeunload = function(){
			let closeMessage = {"closing" : context.playerId};
			context.webSocket.send(JSON.stringify(closeMessage));
			context.webSocket.close();
		}

    }


    getState() {
		// console.log(this.state)
        this.state[this.playerId].x = this.playerKnight.x;
        this.state[this.playerId].y = this.playerKnight.y;
        return JSON.stringify(this.state)
    }

    register() {

    }

    // Update game state on server
    update(state) {
        this.state = state;
        for (let id in this.state) {
            if (!(id in this.knights)) {
				console.log('making new knight')
				this.knights[id] = new Knight();
				if (id == this.playerId){
					this.playerKnight = this.knights[id];
				}
                this.stage.addChild(this.knights[id]);
			}
			else {
                this.knights[id].x = this.state[id].x;
                this.knights[id].y = this.state[id].y;
            }
		}
		
		for (let id in this.knights){
			if (!(id in this.state)){
				console.log('deleting knights')
				let knight = this.knights[id];
				this.stage.removeChild(knight);
				delete this.knights[id];
			}
		}
    }













    keyboard(value) {
        let key = {};
        key.value = value;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = event => {
            if (event.key === key.value) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };

        //The `upHandler`
        key.upHandler = event => {
            if (event.key === key.value) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        };

        //Attach event listeners
        const downListener = key.downHandler.bind(key);
        const upListener = key.upHandler.bind(key);

        window.addEventListener(
            "keydown", downListener, false
        );
        window.addEventListener(
            "keyup", upListener, false
        );

        // Detach event listeners
        key.unsubscribe = () => {
            window.removeEventListener("keydown", downListener);
            window.removeEventListener("keyup", upListener);
        };

        return key;
    }


    contain(sprite, container) {

        let collision = undefined;

        //Left
        if (sprite.x < container.x) {
            sprite.x = container.x;
            collision = "left";
        }

        //Top
        if (sprite.y < container.y) {
            sprite.y = container.y;
            collision = "top";
        }

        //Right
        if (sprite.x + sprite.width > container.width) {
            sprite.x = container.width - sprite.width;
            collision = "right";
        }

        //Bottom
        if (sprite.y + sprite.height > container.height) {
            sprite.y = container.height - sprite.height;
            collision = "bottom";
        }

        //Return the `collision` value
        return collision;
    }

}