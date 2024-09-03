function generateParabola(dotsNumber, from, to) {
    var dots = [];

    // Перевірка на збіг початкових та кінцевих координат
    if (from.x === to.x && from.y === to.y) {
        console.warn('The start and end points are the same, returning a single point.');
        return [{x: from.x, y: from.y}];
    }

    // Визначаємо вершину параболи (середину між точками from і to по осі x, і максимальною висотою y)
    var vertexX = (from.x + to.x) / 2;
    var vertexY = Math.min(from.y, to.y) - Math.abs(from.x - to.x) / 2;

    // Коефіцієнт параболи a
    var a = (from.y - vertexY) / Math.pow(from.x - vertexX, 2);

    // Генеруємо точки параболи
    for (var i = 1; i <= dotsNumber; i++) {
        var t = i / dotsNumber;
        var x = from.x + t * (to.x - from.x);
        var y = a * Math.pow(x - vertexX, 2) + vertexY;

        // Перевірка на коректність координат
        if (isNaN(x) || isNaN(y)) {
            console.warn('Invalid coordinates generated, skipping this point.');
            continue;
        }

        dots.push({x: x, y: y});
    }

    return dots;
}

function generateLine(dotsNumber, from, to) {
    var dots = [];

    // Перевірка на збіг початкових та кінцевих координат
    if (from.x === to.x && from.y === to.y) {
        // console.warn('The start and end points are the same, returning a single point.');
        return [{x: from.x, y: from.y}];
    }

    for (var i = 1; i <= dotsNumber; i++) {
        var t = i / dotsNumber;
        var x = from.x + t * (to.x - from.x);
        var y = from.y + t * (to.y - from.y);

        // Перевірка на коректність координат
        if (isNaN(x) || isNaN(y)) {
            // console.warn('Invalid coordinates generated, skipping this point.');
            continue;
        }

        dots.push({x: x, y: y});
    }

    return dots;
}


function startTimer(duration, callback) {
    setTimeout(() => {
        callback();
    }, duration * 1000); // Convert seconds to milliseconds
} 

function random(min, max) {
    min = Math.ceil(min);  // Округлення до більшого цілого
    max = Math.floor(max); // Округлення до меншого цілого
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playMusic(sounds) {
    // Відтворюємо поточну мелодію
    sounds[currentTrack].play();
    
    // Встановлюємо обробник події завершення відтворення
    sounds[currentTrack].onended(() => {
      // Переходимо до наступної мелодії
      currentTrack = (currentTrack + 1) % sounds.length;
      // Відтворюємо наступну мелодію
      playMusic(sounds);
    });
  }

function updateInterface() {
    if(music) {
        $('#musicButton').text('MUSIC ON')
    };
    if(!music) {
        $('#musicButton').text('MUSIC OFF')
    };

    if(sound) {
        $('#soundButton').text('SOUND ON')
    }; 
    if(!sound) {
        $('#soundButton').text('SOUND OFF')
    };

    if(visualization) {
        $('#visualization').text('VERY QUICK MODE OFF')
    }; 
    if(!visualization) {
        $('#visualization').text('VERY QUICK MODE ON')
    };

    if(quickMode) {
        $('#quickMode').text('QUICK MODE ON')
    }; 
    if(!quickMode) {
        $('#quickMode').text('QUICK MODE OFF')
    };
}