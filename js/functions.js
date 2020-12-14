console.log( "functions.js successfully imported" );

var timeSet = 3;
var quizQuestionsArr = buildQuestionList( q1, q2, q3, q4 );

function buildQuestionList() {
    var arr = [];
    for ( var i = 0; i < arguments.length; i++ ) {
        arr.push( arguments[ i ] );
    }
    return arr;
}

// Displays the chosen question in the DOM. Written to randomize the location of the answer.
function displayQuestion( index ) {
    var quizQuestion = quizQuestionsArr[ index ];
    var keysNum = Object.keys( quizQuestion );
    var headerText = document.querySelector( "#header_text" );
    var answerField = document.querySelector( "#answer_field" );
    var answersArray = [];

    // put all answers in answersArray so their order can be randomized without modifying the quizQuestion object.
    for ( var i = 1; i < keysNum.length - 1; i++ ) {
        answersArray.push( quizQuestion[ i ] );
    }

    // We start on answer #1.
    var answerNum = 1;
    while ( answersArray.length > 0 ) {
        // Randomize the order in which answers appear.
        var arrIndex = Math.floor( Math.random() * answersArray.length );
        var newButton = document.createElement( "button" );
        newButton.textContent = `${ answerNum }. ${answersArray[ arrIndex ]}`;
        answerField.appendChild( newButton );
        newButton.insertAdjacentHTML('afterend', '<br>');

        answersArray.splice( arrIndex, 1 );
        answerNum++;
    }
    console.log( answersArray );
    console.log( `The answer is ${quizQuestion.answer}` );

    headerText.textContent = quizQuestion.question;
}

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
displayQuestion( 0 );