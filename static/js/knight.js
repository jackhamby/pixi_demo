class Knight extends PIXI.Sprite{
    constructor(){
        super(PIXI.loader.resources["/static/images/knight.png"].texture);
        // this.speed = 2;
        this.vx = 0;
        this.vy = 0;
    }



    move(xDir, yDir){
        // this.position.set(pos[0] + (dir * this.speed), pos[1]);
        // console.log('set position');
        // this.position.set(this.x + (this.speed * xDir), this.y + (this.speed * yDir));
    }
}