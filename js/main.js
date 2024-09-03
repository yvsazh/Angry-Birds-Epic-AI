const WIDTH = 1100;
const HEIGHT = 700;
var backgroundImage;
var shieldImage;

var nnBirds = [];
var enemyBirds = [];

var games = 0;
var nnWon = 0;
var nnLost = 0;
var nothing = 0;
var winStreak = 0;
var loseStreak = 0;

var env;
var ppo;

var quickMode = false;

var globalSteps = [0];
var rewards = [0];

var sound = true;
var music = true;
var redSounds = {attack: [], damage: [], skill: []};
var bombSounds = {attack: [], damage: [], skill: []};
var matildaSounds = {attack: [], damage: [], skill: []};

var visualization = true;

var musicTracks = [];
var currentTrack = 0;

var rewardPlot = document.getElementById('rewardPlot');

var nnBirdsChosen = JSON.parse(localStorage.getItem('nnBirdsChosen'));
var enemyBirdsChosen = JSON.parse(localStorage.getItem('enemyBirdsChosen'));

function preload() {
	soundFormats('mp3');
	backgroundImage = loadImage('/assets/background.jpg');
	shieldImage = loadImage('assets/shield.png');
	powerupImage = loadImage('assets/powerup.png');

	redSounds.attack = [loadSound('/assets/sounds/red/attack1.mp3'), loadSound('/assets/sounds/red/attack2.mp3'), loadSound('/assets/sounds/red/attack3.mp3')]
	redSounds.damage = [loadSound('/assets/sounds/red/damage1.mp3'), loadSound('/assets/sounds/red/damage2.mp3'), loadSound('/assets/sounds/red/damage3.mp3')]
	redSounds.skill = [loadSound('/assets/sounds/red/skill1.mp3'), loadSound('/assets/sounds/red/skill2.mp3'), loadSound('/assets/sounds/red/skill3.mp3')]

	bombSounds.attack = [loadSound('/assets/sounds/bomb/attack1.mp3'), loadSound('/assets/sounds/bomb/attack2.mp3'), loadSound('/assets/sounds/bomb/attack3.mp3')]
	bombSounds.damage = [loadSound('/assets/sounds/bomb/damage1.mp3'), loadSound('/assets/sounds/bomb/damage2.mp3'), loadSound('/assets/sounds/bomb/damage3.mp3')]
	bombSounds.skill = [loadSound('/assets/sounds/bomb/skill1.mp3'), loadSound('/assets/sounds/bomb/skill2.mp3'), loadSound('/assets/sounds/bomb/skill3.mp3')]

	matildaSounds.attack = [loadSound('/assets/sounds/matilda/attack1.mp3'), loadSound('/assets/sounds/matilda/attack2.mp3'), loadSound('/assets/sounds/matilda/attack3.mp3')]
	matildaSounds.damage = [loadSound('/assets/sounds/matilda/damage1.mp3'), loadSound('/assets/sounds/matilda/damage2.mp3'), loadSound('/assets/sounds/matilda/damage3.mp3')]
	matildaSounds.skill = [loadSound('/assets/sounds/matilda/skill1.mp3'), loadSound('/assets/sounds/matilda/skill2.mp3'), loadSound('/assets/sounds/matilda/skill3.mp3')]

	// ---
	musicTracks = [loadSound('/assets/music/1.mp3'), loadSound('/assets/music/2.mp3')]
}

function setup() {
	var cnv = createCanvas(WIDTH, HEIGHT);
	cnv.parent('game');
	Plotly.newPlot(rewardPlot, [{
		x: globalSteps,
		y: rewards
	}], {
		margin: { t: 0 }
	});

	playMusic(musicTracks);

	for (var i = 0; i < nnBirdsChosen.length; i++) {
		var pos = {x: 0, y: 0}
		if (i == 0) {
			pos.x = 300;
			pos.y = 200;
		}
		if (i == 1) {
			pos.x = 400;
			pos.y = 340;
		}
		if (i == 2) {
			pos.x = 300;
			pos.y = 480;
		}
		if (nnBirdsChosen[i] == "red") {
			nnBirds.push(new Red(pos.x, pos.y, "bird", 29, 200, redSounds));
		}
		if (nnBirdsChosen[i] == "matilda") {
			nnBirds.push(new Matilda(pos.x, pos.y, "bird", 20, 300, matildaSounds));
		}
		if (nnBirdsChosen[i] == "bomb") {
			nnBirds.push(new Bomb(pos.x, pos.y, "bird", 50, 140, bombSounds));
		}
	}

	for (var i = 0; i < nnBirdsChosen.length; i++) {
		var pos = {x: 0, y: 0}
		if (i == 0) {
			pos.x = 800;
			pos.y = 200;
		}
		if (i == 1) {
			pos.x = 700;
			pos.y = 340;
		}
		if (i == 2) {
			pos.x = 800;
			pos.y = 480;
		}
		if (enemyBirdsChosen[i] == "red") {
			enemyBirds.push(new Red(pos.x, pos.y, "enemy", 29, 200, redSounds));
		}
		if (enemyBirdsChosen[i] == "matilda") {
			enemyBirds.push(new Matilda(pos.x, pos.y, "enemy", 20, 300, matildaSounds));
		}
		if (enemyBirdsChosen[i] == "bomb") {
			enemyBirds.push(new Bomb(pos.x, pos.y, "enemy", 50, 140, bombSounds));
		}
	}

	env = new Env();
	env.reset();
	
	// Налаштування PPO агента
	// які налаштування треба поставити тут?
	ppo = new PPO(env, {
		nSteps: 1024, 
		nEpochs: 20, 
		policyLearningRate: 1e-3, 
		valueLearningRate: 1e-3,
		netArch: { 'pi': [64, 64], 'vf': [64, 64] },
		targetKL: 0.01,
		clipRatio: 0.2,
	});

	(async () => {
		await ppo.learn({
			totalTimesteps: 1000000,
			callback: {
				onTrainingStart: function (p) {
					console.log("Training started with config:", p.config);
				},
				onStep: async function () {
					globalSteps.push(globalSteps[globalSteps.length - 1] + 1);
					if (globalSteps.length > 1000) {
						globalSteps.shift();
						rewards.shift();
					}
					Plotly.update(rewardPlot, {
						x: [globalSteps],
						y: [rewards]
					}, {
						margin: { t: 0 }
					});
				},
				onTrainingEnd: async function () {
					console.log("Training finished");
				},
				onRolloutEnd: async (_) => {
					$("#nnTrain").text(Number($("#nnTrain").text()) + 1);
				}
			}
		});
	})();
}

function draw() {
	env.render();
	if (music) {
		for (var i = 0; i < musicTracks.length; i++) {
			musicTracks[i].setVolume(0.8);
		}
	} else {
		for (var i = 0; i < musicTracks.length; i++) {
			musicTracks[i].setVolume(0);
		}        
	}
}