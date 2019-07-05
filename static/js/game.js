
// Class for client-side game object
// Hol
class Game extends PIXI.Application{
    constructor(){
        super({width: 256, height: 256});
        // this.knights = [];
        this.state = {};
        this.knights = {};
        this.playerKnight = null;
        this.playerId = null;
    
    }

    init(){
        PIXI.loader
            .add("/static/images/knight.png")
            .load(this.setup.bind(this)); 

    }


    gameLoop(delta){
      console.log(this.knights)
        for (let id in this.knights){
            let knight = this.knights[id];
            knight.x += knight.vx;
            knight.y += knight.vy;
            let knightHitsWall = this.contain(knight, {x: 0, y: 0, width: this.screen.width, height: this.screen.height});
            if (knight.vy <= 0){
                knight.vy += 3;
            }
        }
        this.renderer.render(this.stage);

    }

    setup(){
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
          console.log(error)
        };
        
        // Log messages from the server
        // this.webSocket.onmessage = function (e) {
        //   console.log('Server: ' + e.data);
        // };

        this.webSocket.onmessage = function (event) {
          let state = JSON.parse(event.data);
          if ("init" in state){
            context.playerId = state["init"]
          }
          context.update(state);
        };

        // Create sprite
        // let knight = new Knight();
        // this.knights.push(knight);
        // this.stage.addChild(knight);
        
        // Start game loop
        this.ticker.add(delta => context.gameLoop(delta));
    
        // Attach keyboard handlers
        let left = this.keyboard("a"),
        right = this.keyboard("d"),
        down = this.keyboard("s"),
        space = this.keyboard(" ");

        // space.press = () => {
        //     for (let i in context.knights){
        //         let knight = this.knights[i];
        //         knight.vy = -15;
        //     }
        // }

        // down.press = () => {
        //     for (let i in context.knights){
        //         let knight = this.knights[i];
        //         knight.vy = 2;
        //     }

        // };
        // down.release = () => {
        //     knight.vy = 0;
        // };

        // right.press = () => {
        //     for (let i in context.knights){
        //         let knight = this.knights[i];
        //         knight.vx = 2;
        //     }
        // };
        // right.release = () => {
        //     knight.vx = 0;
        // };

        // left.press = () => {
        //     for (let i in context.knights){
        //         let knight = this.knights[i];
        //         knight.vx = -2;
        //     }
        // };

        // left.release = () => {
        //     knight.vx = 0;
        // };
    
    }

    register(){

    }

    // Update game state on server
    update(state){
      this.state = state;
      if (!this.playerKnight){
        // Create players knight and at to the statues
        this.playerKnight = new Knight();
        let playerId = crea
      }
      for (let id in this.state){
        if (!(id in this.knights)){
          this.knights[id] = new Knight();
          console.log('created new knight ')
          console.log(this.knights);
          this.stage.addChild(this.knights[id]);

        }
        else{
          console.log('udating state')
          console.log(this.state)
          this.knights[id].x = this.state[id].x;
          this.knights[id].y = this.state[id].y;
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

