class PowerUp extends Effect {
    constructor(goal, duration, type) {
        super(goal, duration, type);
        this.goal = goal;
        this.duration = duration;
        this.spriteSize = createVector(goal.sprite.width, goal.sprite.height);
        this.alpha = 0; // Початкова прозорість
        this.scaleFactor = 0.2; // Масштабування анімації
        this.speed = 2;

        // Визначення початкової позиції залежно від типу
        if (goal.type === "enemy") {
            this.position = createVector(this.spriteSize.x * 0.4, this.spriteSize.y - 110); // Зліва по x і по центру по y
            this.direction = createVector(-1, -1).normalize(); // Рух вліво і вгору
        } else {
            this.position = createVector(-this.spriteSize.x * 0.4, this.spriteSize.y - 110); // Справа по x і по центру по y
            this.direction = createVector(1, -1).normalize(); // Рух вправо і вгору
        }
    }

    action(damageNum) {
        return damageNum += (damageNum/100) * 25
    }

    draw() {
        // Оновлення позиції
        this.position.add(this.direction.copy().mult(this.speed));

        // Оновлення прозорості на основі позиції
        let progressX = map(this.position.x, -this.spriteSize.x * 0.4, this.spriteSize.x * 0.4, 0, 1);
        let progressY = map(this.position.y, 0, this.spriteSize.y * 0.5, 0, 1);

        if (progressX < 0.5) {
            this.alpha = map(progressX, 0, 0.5, 0, 255); // Прозорість збільшується до середини шляху
        } else {
            this.alpha = map(progressX, 0.5, 1, 255, 0); // Прозорість зменшується в кінці шляху
        }

        // Перевірка на досягнення країв спрайту
        if (progressX >= 1 || progressX <= 0) {
            // Повернення на початкову позицію
            if (this.goal.type === "enemy") {
                this.position = createVector(this.spriteSize.x * 0.4, this.spriteSize.y - 110);
            } else {
                this.position = createVector(-this.spriteSize.x * 0.4, this.spriteSize.y- 110);
            }
            this.direction = this.direction.mult(-1); // Зміна напрямку
        }

        // Малювання зображення з врахуванням прозорості та масштабування
        push();
        translate(
            this.goal.sprite.position.x + this.position.x,
            this.goal.sprite.position.y + this.position.y
        );
        if (this.goal.type === "enemy") {
            scale(-this.scaleFactor, this.scaleFactor); // Застосування масштабування і дзеркального відображення
        } else {
            scale(this.scaleFactor); // Застосування масштабування
        }
        tint(255, this.alpha); // Застосування прозорості
        image(powerupImage, 0, 0);
        pop();
    }
}
