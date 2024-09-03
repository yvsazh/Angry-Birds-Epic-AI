class Fighter {
    constructor(x, y, type, character, frames) {
        this.startX = x;
        this.startY = y;
        this.sprite = new Sprite(x, y, 300, 300, 'static');
        // this.sprite.debug = true;
        this.sprite.scale = 0.4;
        this.character = character;
        this.frames = frames;

        this.healing = false;

        // Adding animations
        this.sprite.addAnimation('idle', `assets/characters/${this.character}/idle/img0.png`, this.frames.idle[0]);
        this.sprite.animation.frameDelay = this.frames.idle[1];
        if (this.character != "red") {
            this.sprite.animation.scale = 1.1;
        }
        this.sprite.addAnimation('attack', `assets/characters/${this.character}/attack/img0.png`, this.frames.attack[0]);
        this.sprite.animation.frameDelay = this.frames.attack[1];
        if (this.character != "red") {
            this.sprite.animation.scale = 1.1;
        }
        this.sprite.animation.noLoop();
        this.sprite.addAnimation('skill', `assets/characters/${this.character}/skill/img0.png`, this.frames.skill[0]);
        this.sprite.animation.noLoop();
        this.sprite.animation.frameDelay = this.frames.skill[1];
        this.sprite.animation.scale = 1.3;
        this.sprite.addAnimation('damage', `assets/characters/${this.character}/damage/img0.png`, this.frames.damage[0])
        this.sprite.animation.noLoop();
        this.sprite.animation.frameDelay = this.frames.damage[1];
        if (this.character != "red") {
            this.sprite.animation.scale = 1.1;
        }

        this.state = "idle";
        this.attackIndex = 0;
        this.attackDots = [];
        this.type = type;
        this.attackGoal = {x: 700, y: 300};
        if (type == "enemy") {
            this.sprite.mirror.x = true;
        };

        this.steps = 0;

        this.effects = [];

        this.first = true;
    }

    draw() {
        if (this.state == "idle") {
            this.sprite.changeAnimation(this.state);
            if (this.first) {this.sprite.position.x = this.startX;}
        }

        if (this.healing == true) {
            if (this.healText) {
                this.drawHealthText();
            }
        }

        // attacking
        if (this.state == "attack") {
            if (this.attackDots.length === 0) {
                if (this.character == "red") {
                    this.attackDots = generateParabola(15, {x: this.sprite.position.x, y: this.sprite.position.y}, this.attackGoal);
                } else {
                    this.attackDots = generateLine(10, {x: this.sprite.position.x, y: this.sprite.position.y}, this.attackGoal);
                }
            } 

            this.sprite.changeAnimation(this.state);
            this.moveSprite(this.sprite, this.attackDots, () => {
                this.state = "idle";
                this.attackDots = [];
                startTimer(1, () => { this.state = "runback" });
            });
        }

        // running back
        if (this.state == "runback") {
            this.sprite.changeAnimation('idle');
            this.lineDots = generateLine(15, {x: this.sprite.position.x, y: this.sprite.position.y}, {x: this.startX, y: this.startY});
            this.moveSprite(this.sprite, this.lineDots, () => {
                this.state = "idle";
                startTimer(1, () => { this.state = "idle" });
            });
        }

        if (this.state == "skill") {
            this.sprite.changeAnimation(this.state);
            this.sprite.animation.play();
            if (this.character == "bomb" || this.character == "matilda") {
                var bombSkill = [
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y - 10},
                    
                    {x: this.sprite.position.x, y: this.sprite.position.y},
                    {x: this.sprite.position.x, y: this.sprite.position.y},
                    {x: this.sprite.position.x, y: this.sprite.position.y},
                    {x: this.sprite.position.x, y: this.sprite.position.y},
                    {x: this.sprite.position.x, y: this.sprite.position.y},
                    {x: this.sprite.position.x, y: this.sprite.position.y},

                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},
                    {x: this.sprite.position.x, y: this.sprite.position.y + 10},

                    {x: this.startX, y: this.startY},
                ]
                this.moveSprite(this.sprite, bombSkill, () => {
                    this.sprite.animation.stop();
                    this.sprite.animation.frame = 0;
                    this.state = "idle";
                    this.sprite.animation.frame = 0;
                });
            }
        }
        if (this.state == "damage") {
            this.sprite.changeAnimation(this.state);
            if (this.type != "enemy") {
                var backAndBack = [
                    {x:this.sprite.position.x - 20, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 50, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 10, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 10, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 20, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 50, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 10, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 10, y: this.sprite.position.y},
                ]
            } else {
                var backAndBack = [
                    {x:this.sprite.position.x + 20, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 50, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 10, y: this.sprite.position.y},
                    {x:this.sprite.position.x + 10, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 20, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 50, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 10, y: this.sprite.position.y},
                    {x:this.sprite.position.x - 10, y: this.sprite.position.y},
                ]               
            }

            this.moveSprite(this.sprite, backAndBack, () => {
                this.state = "idle";
            });
        }
        for (var effect of this.effects) {
            if (effect.active) {
                effect.draw();
            }
        }
        this.first = false;
    }

    // Method to move a sprite along a path of dots
    moveSprite(sprite, dots, onComplete, index = 0) {
        if (this.attackIndex < dots.length) {
            sprite.position.x = dots[this.attackIndex].x;
            sprite.position.y = dots[this.attackIndex].y;
            this.attackIndex++;
        } else {
            this.attackIndex = 0;
            if (onComplete) {
                onComplete();
            }
        }
    }
}
