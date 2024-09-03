class Bird extends Fighter {
	constructor(x, y, type, character, frames, damageNum, hp, sounds) {
		super(x, y, type, character, frames);
		this.type = type;

		this.damageNum = damageNum;
		this.hp = hp;
		this.previousHp = hp;
		this.maxHp = hp;

		this.damageText = null; // Змінна для збереження тексту урону
		this.damageTextY = 0; // Зміщення по Y для анімації
		this.damageTextOpacity = 0; // Прозорість тексту урону

		this.healText = null; // Змінна для збереження тексту урону
		this.healTextY = 0; // Зміщення по Y для анімації
		this.healTextOpacity = 0; // Прозорість тексту урону
		this.font = loadFont('assets/font.ttf');

		this.sounds = sounds;
		this.dead = false;
	}

	attack(goal) {
		if (sound && this.hp > 0) {
            this.sounds.attack[Math.floor(Math.random() * this.sounds.attack.length)].play();
        }
		if (this.type == "enemy") {
			this.attackGoal.x = goal.startX + 100;
		} else {
			this.attackGoal.x = goal.startX - 100;
		}

		this.attackGoal.y = goal.startY;

		this.state = "attack";
		return new Promise((resolve) => {
			if (visualization) {
				startTimer(0.2, () => {
					var damageNum = this.damageNum
					for (var effect of this.effects) {
						if (effect.active && effect.type == "attack") {
							damageNum = effect.action(damageNum);
							break;
						}
					}
					goal.damage(damageNum);
					resolve();
				});
			} else {
				var damageNum = this.damageNum
				for (var effect of this.effects) {
					if (effect.active && effect.type == "attack") {
						damageNum = effect.action(damageNum);
						break;
					}
				}
				goal.damage(damageNum);
				resolve();			
			}

		});
	}

	damage(damageNum) {
		if (sound && this.hp > 0) {
            this.sounds.damage[Math.floor(Math.random() * this.sounds.damage.length)].play();
        }
		this.state = "damage";
		for (var effect of this.effects) {
			if (effect.active && effect.type == "damage") {
				damageNum = effect.action(damageNum);
				break;
			}
		}
		this.hp -= damageNum;

		// Додаємо текст для урону
		this.damageText = "-" + parseInt(damageNum).toString();
		this.damageTextY = this.sprite.position.y; // Початкова позиція тексту по Y
		this.damageTextOpacity = 255; // Початкова прозорість тексту

		return false;
	}

	heal(healNum) {
		if (this.hp > 0) {
			this.healing = true;

			this.hp += healNum;
			if (this.hp > this.maxHp) {
				this.hp = this.maxHp;
			}
			// Додаємо текст для урону
			this.healText = "+" + parseInt(healNum).toString();
			this.healTextY = this.sprite.position.y; // Початкова позиція тексту по Y
			this.healTextOpacity = 255; // Початкова прозорість тексту
			
			return false;
		}
	}

	skill() {
		console.log("no skill");
	}

	update() {
		if (this.hp > 0) {
			this.drawHealthBar();
			this.draw();
			// Відображаємо текст урону, якщо він є
			if (this.damageText) {
				this.drawDamageText();
			}
			this.previousHp = this.hp;
		} else {
			textFont(this.font);
			fill(255, 0, 0);
			textSize(70);
			textAlign(CENTER);
			text("DEAD", this.sprite.position.x, this.sprite.position.y - 50);
		}
	}

	drawDamageText() {
		// Налаштування кольору з прозорістю
		textFont(this.font);
		fill(255, 0, 0, this.damageTextOpacity);
		textSize(70);
		textAlign(CENTER);
		
		// Відображення тексту над птахом
		text(this.damageText, this.sprite.position.x, this.damageTextY);

		// Анімація тексту: підняття вгору та зменшення прозорості
		this.damageTextY -= 2;
		this.damageTextOpacity -= 3;

		// Приховуємо текст після завершення анімації
		if (this.damageTextOpacity <= 0) {
			this.damageText = null;
		}
	}
	
	drawHealthText() {
		// Налаштування кольору з прозорістю
		textFont(this.font);
		fill(0, 255, 0, this.healTextOpacity);
		textSize(70);
		textAlign(CENTER);
		
		// Відображення тексту над птахом
		text(this.healText, this.sprite.position.x, this.healTextY);

		// Анімація тексту: підняття вгору та зменшення прозорості
		this.healTextY -= 2;
		this.healTextOpacity -= 3;

		// Приховуємо текст після завершення анімації
		if (this.healTextOpacity <= 0) {
			this.healText = null;
		}
	}
	drawHealthBar() {
		let barWidth = 100;
		let barHeight = 15;
		let barX = this.sprite.position.x - barWidth / 2;
		let barY = this.sprite.position.y + this.sprite.height / 2 + 30;

		fill(200, 0, 0);
		rect(barX-2, barY-2, barWidth+4, barHeight+4, 5);
		
		let currentHealthWidth = map(this.hp, 0, this.maxHp, 0, barWidth);
		
		fill(255, 100, 100);
		rect(barX, barY, currentHealthWidth, barHeight/2, 5, 5, 0, 0);
		fill(255, 0, 0);
		rect(barX, barY+barHeight/2, currentHealthWidth, barHeight/2, 0, 0, 5, 5);
	}
}
