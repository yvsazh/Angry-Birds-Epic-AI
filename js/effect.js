class Effect {
    constructor(goal, duration, type) {
        this.goal = goal;
        this.duration = duration;
        this.active = true;
        this.type = type;
    }

    action() {

    }

    update() {
        this.duration--;
        if (this.duration <= 0) {
            this.active = false;
        }
    }
}