class Bomb extends Bird {
	constructor(x, y, type, damageNum, hp, sounds){
		super(x, y, type, "bomb", {idle: [12, 3], attack: [1, 1], skill: [7, 2], damage: [1, 1]}, damageNum, hp, sounds);
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
                    var newPowerUp = new PowerUp(goal, 3, "attack")
                    if (!goal.effects.some(element => element instanceof PowerUp)) {
                        goal.effects.push(newPowerUp);
                    } else {
                        goal.effects = goal.effects.map(item => item instanceof PowerUp ? newPowerUp : item);
                    }
                    resolve();
                });
            } else {
                                  var newPowerUp = new PowerUp(goal, 3, "attack")
                    if (!goal.effects.some(element => element instanceof PowerUp)) {
                        goal.effects.push(newPowerUp);
                    } else {
                        goal.effects = goal.effects.map(item => item instanceof PowerUp ? newPowerUp : item);
                    }
                    resolve();  
            }

        });

	}
}