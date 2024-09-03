class Env {
	constructor() {
		this.actionSpace = {
			'class': 'Box',
			'shape': [nnBirds.length*6], // Each bird has 6 possible actions
		};
		this.observationSpace = {
			'class': 'Box',
			'shape': [24], // (24) Спостереження включають параметри всіх пташок
			'dtype': 'float32'
		};

		this.maxI = 300;
	}

	reset() {
		nnBirds.forEach((bird, i) => {
			bird.sprite.position.x = 300;
			bird.sprite.position.y = 200 + i * 140;
			bird.hp = bird.maxHp;
			bird.sprite.state = "idle";
			bird.sprite.changeAnimation("idle");
		});
		
		enemyBirds.forEach((bird, i) => {
			bird.sprite.position.x = 800;
			bird.sprite.position.y = 200 + i * 140;
			bird.hp = bird.maxHp;
			bird.sprite.state = "idle";
			bird.sprite.changeAnimation("idle");
		});

		this.i = 0;
		return this.getObservations();
	}

	getObservations() {
		var observations = [];
		nnBirds.forEach(bird => {
			var shieldDuration = bird.effects.some(element => element instanceof Shield) ? bird.effects[0].duration : 0;
			var powerUpDuration = bird.effects.some(element => element instanceof PowerUp) ? bird.effects[0].duration : 0;
			observations.push(bird.hp, Number(shieldDuration > 0), Number(powerUpDuration > 0), Number(bird.hp > 0));
		});

		enemyBirds.forEach(bird => {
			var shieldDuration = bird.effects.some(element => element instanceof Shield) ? bird.effects[0].duration : 0;
			var powerUpDuration = bird.effects.some(element => element instanceof PowerUp) ? bird.effects[0].duration : 0;
			observations.push(bird.hp, Number(shieldDuration > 0), Number(powerUpDuration > 0), Number(bird.hp > 0));
		});

		return observations;
	}

	async step(action) {

		this.i += 1;
		var reward = 0;

		for (let i = 0; i < nnBirds.length; i++) {
			let birdAction = action.slice(i * 6, (i+1)*6); 

			if (nnBirds[i].hp > 0) {
				var decision = Math.max(...birdAction);
				var decisionI = birdAction.indexOf(decision);
				if (decisionI < 3) {
					await nnBirds[i].attack(enemyBirds[decisionI]);
					reward += this.calculateAttackReward(enemyBirds[decisionI]);	
				} else {
					let targetIndex = Math.floor(decisionI - 3); 
					await nnBirds[i].skill(nnBirds[targetIndex]);
                    reward += this.calculateSkillReward(nnBirds[i], nnBirds[targetIndex]);
					
				}
			}
	
			enemyBirds.forEach(bird => {
				if (bird.hp > 0) {
					reward += (bird.previousHp - bird.hp);
				}
			});
	
			this.updateEffects(nnBirds[i]);
	
			if (!quickMode) {
				await this.waitForAnimationsToEnd();
			}
		}
	

		let enemyActions = [];
		for (let i = 0; i < enemyBirds.length * 6; i++) {
			enemyActions.push(Math.random() * 200 - 100);
		}
	

		for (let i = 0; i < enemyBirds.length; i++) {
			let enemyAction = enemyActions.slice(i * 6, (i+1)*6); 

			if (enemyBirds[i].hp > 0) {
				var decision = Math.max(...enemyAction);
				var decisionI = enemyAction.indexOf(decision);
				var validTarget = this.selectValidAction(nnBirds);
				if (decisionI < 3) {
					await enemyBirds[i].attack(nnBirds[validTarget]);
                    reward -= this.calculateAttackReward(nnBirds[validTarget]);
				} else {
					let targetIndex = Math.floor(decisionI - 3); 
					await enemyBirds[i].skill(enemyBirds[targetIndex]);
                    reward -= this.calculateSkillReward(enemyBirds[i], enemyBirds[targetIndex]);
				}
	
				this.updateEffects(enemyBirds[i]);
	
				if (!quickMode) {
					await this.waitForAnimationsToEnd();
				}
			}
		}
	
		// nnBirds.forEach(bird => {
		// 	if (bird.hp > 0) {
		// 		reward -= (bird.previousHp - bird.hp);
		// 	}
		// });
	
		// if (reward < 0) {
		// 	reward = 0;
		// }

		var done = this.checkIfGameOver();
	
		if (done) {
			games += 1;
			if (nnBirds.some(bird => bird.hp > 0) && this.i < this.maxI) {
				nnWon++;
				reward += 20;
				winStreak++;
				loseStreak = 0;
			} else if (!nnBirds.some(bird => bird.hp > 0) && enemyBirds.some(bird => bird.hp > 0) && this.i < this.maxI) {
				nnLost++;
				loseStreak++;
				// reward -= 20;
				winStreak = 0;
			} else if (this.i > this.maxI) {
				nothing++;
				// reward -= 10;
			}
			document.getElementById("games").innerText = games;
			document.getElementById("nnWon").innerText = nnWon;
			document.getElementById("nnLost").innerText = nnLost;
			document.getElementById("nothing").innerText = nothing;
			document.getElementById("loseStreak").innerText = loseStreak;
			document.getElementById("winStreak").innerText = winStreak;
			if (loseStreak > 2) {
				$(".loseStreakp").css("display", "block");
			} else {
				$(".loseStreakp").css("display", "none");
			}
			if (winStreak > 2) {
				$(".winStreakp").css("display", "block");
			} else {
				$(".winStreakp").css("display", "none");
			}
			this.i = 0;
		}
		rewards.push(reward);

		return [this.getObservations(), reward, done];
	}

	calculateAttackReward(target) {
        // Reward based on the damage dealt to the target
        let damage = target.previousHp - target.hp;
        if (target.hp <= 0) {
            return 10 + damage; // Extra reward for killing the target
        }
        return damage;
    }

    calculateSkillReward(actor, target) {
        // Reward based on the effectiveness of the skill
        if (actor.hp < actor.maxHp * 0.5 && actor !== target) {
            return 5; // Reward for using a healing or protective skill
        }
        return 1; // Minimal reward for using any skill
    }
	selectValidAction(birdTeam) {
		let validTargets = birdTeam.map((bird, index) => bird.hp > 0 ? index : -1).filter(index => index >= 0);
		if (validTargets.length > 0) {
			return validTargets[Math.floor(Math.random() * validTargets.length)];
		} else {
			return 0; // Якщо всі пташки мертві, що малоймовірно, повертаємо 0
		}
	}

	updateEffects(bird) {
		for (let i = bird.effects.length - 1; i >= 0; i--) {
			let effect = bird.effects[i];
			if (effect.active) {
				effect.update();
			} else {
				bird.effects.splice(i, 1);
			}
		}
	}

	checkIfGameOver() {
		let nnAlive = nnBirds.some(bird => bird.hp > 0);
		let enemyAlive = enemyBirds.some(bird => bird.hp > 0);
		return !nnAlive || !enemyAlive || this.i > this.maxI;
	}

	async waitForAnimationsToEnd() {
		return new Promise((resolve) => {
			if (visualization) {
				startTimer(2.5, () => {
					resolve();
				});
			}
			else {
				startTimer(0.000000001, () => {
					resolve();
				});
			}
		});
	}

	render() {
		backgroundImage.resize(WIDTH, HEIGHT);
		image(backgroundImage, 0, 0);

		nnBirds.forEach(bird => bird.update());
		enemyBirds.forEach(bird => bird.update());
	}
}