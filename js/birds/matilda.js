class Matilda extends Bird {
	constructor(x, y, type, damageNum, hp, sounds){
		super(x, y, type, "matilda", {idle: [13, 3], attack: [6, 6], skill: [6, 1], damage: [1, 1]}, damageNum, hp, sounds);
		this.damageNum = damageNum;
		this.hp = hp;
	}
    skill(goal){
        if (sound && this.hp > 0) {
            this.sounds.skill[Math.floor(Math.random() * this.sounds.skill.length)].play();
        }
		this.state = "skill";
        if (goal.hp > 0) {
            goal.heal(29);
        }

        return new Promise((resolve) => {
            if (visualization) {
                startTimer(1.5, () => {
                    goal.state = "idle";
                    goal.healing = false;
                    resolve();
                });
            } else {
                goal.state = "idle";
                goal.healing = false;
                resolve();
            }
        });
	}
}