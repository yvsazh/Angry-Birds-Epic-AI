class Red extends Bird {
	constructor(x, y, type, damageNum, hp, sounds){
		super(x, y, type, "red", {idle: [42, 1], attack: [4, 5], skill: [4, 3], damage: [9, 3]}, damageNum, hp, sounds);
		this.damageNum = damageNum;
		this.hp = hp;
	}
    skill(goal){
        if (sound && this.hp > 0) {
            this.sounds.skill[Math.floor(Math.random() * this.sounds.skill.length)].play();
        }
		this.state = "skill";
        return new Promise((resolve) => {
            if (visualization) {
                startTimer(0.5, () => {
                    this.sprite.animation.stop();
                    this.sprite.animation.frame = 0;
                    this.state = "idle";
                    this.sprite.animation.frame = 0;
                    var newSheild = new Shield(goal, 3, "damage")
                    if (!goal.effects.some(element => element instanceof Shield)) {
                        goal.effects.push(newSheild);
                    } else {
                        goal.effects = goal.effects.map(item => item instanceof Shield ? newSheild : item);
                    }
                    resolve();
                });
            } else {
                                    this.sprite.animation.stop();
                    this.sprite.animation.frame = 0;
                    this.state = "idle";
                    this.sprite.animation.frame = 0;
                    var newSheild = new Shield(goal, 3, "damage")
                    if (!goal.effects.some(element => element instanceof Shield)) {
                        goal.effects.push(newSheild);
                    } else {
                        goal.effects = goal.effects.map(item => item instanceof Shield ? newSheild : item);
                    }
                    resolve();
            }

		});
	}
}