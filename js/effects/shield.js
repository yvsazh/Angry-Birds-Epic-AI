class Shield extends Effect {
    constructor (goal, duration, type) {
        super(goal, duration, type);

        this.goal = goal;
        this.duration = duration;

        this.shieldOpacity = 0; // Initial opacity of the shield
        this.shieldOpacityTarget = 0; // Target opacity of the shield
        this.shieldOpacitySpeed = 0.05; // Speed at which the opacity changes
    }

    action (damageNum) {
        return damageNum -= (damageNum/100) * 55
    }

    draw() {
               // shield login
            if (this.active) {
                this.shieldOpacityTarget = 1; // Fully opaque
            } else {
                this.shieldOpacityTarget = 0; // Fully transparent
            }
    
            // Smoothly transition the shield opacity
            if (this.shieldOpacity < this.shieldOpacityTarget) {
                this.shieldOpacity += this.shieldOpacitySpeed;
                if (this.shieldOpacity > this.shieldOpacityTarget) {
                    this.shieldOpacity = this.shieldOpacityTarget;
                }
            } else if (this.shieldOpacity > this.shieldOpacityTarget) {
                this.shieldOpacity -= this.shieldOpacitySpeed;
                if (this.shieldOpacity < this.shieldOpacityTarget) {
                    this.shieldOpacity = this.shieldOpacityTarget;
                }
            }
    
            if (this.shieldOpacity > 0) {
                var shieldWidth = this.goal.sprite.width+70;
                var shieldHeight = this.goal.sprite.height+50;
                let shieldX = this.goal.sprite.position.x - shieldWidth / 2;
                let shieldY = this.goal.sprite.position.y - shieldHeight / 2;
                tint(255, 255 * this.shieldOpacity);
                image(shieldImage, shieldX, shieldY, shieldWidth, shieldHeight);
                noTint();
            }
    }
}