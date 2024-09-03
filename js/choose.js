var nnBirdsChosen = [];
var enemyBirdsChosen = [];

$("#chooseButton").click(function() {
    nnBirdsChosen = [];
    enemyBirdsChosen = [];
    $(".carousel").each(function(index) {
        var selectedImage = $(this).find(".carousel-item.active img").attr("bird");
        if ((index + 1) > 3) {
            enemyBirdsChosen.push(selectedImage);
        } else {
            nnBirdsChosen.push(selectedImage);
        }
    });

    // Зберігаємо масиви у Local Storage
    localStorage.setItem('nnBirdsChosen', JSON.stringify(nnBirdsChosen));
    localStorage.setItem('enemyBirdsChosen', JSON.stringify(enemyBirdsChosen));

    // Перехід на іншу сторінку
    window.location.href = 'nextPage.html';
});
