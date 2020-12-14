console.log( "functions.js successfully imported" );
var timeSet = 3;

function setTimer( timeSet ) {
    var timerSection = document.querySelector( "#timer_sec" );
    var timer = document.querySelector( "#time" );

    timerSection.style.display = "block";
    timer.textContent = timeSet;

    var timerInterval = setInterval( function( e ) {
        timer.textContent -= 1;
        if ( timer.textContent <= 0 ) {
            clearInterval( timerInterval );
        }
    }, 1000 );

}

function timerPenalty( penaltySeconds ) {
    var timer = document.querySelector( "#time" );
    timer.textContent -= penaltySeconds;
}

setTimer( timeSet );