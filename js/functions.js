console.log( "functions.js successfully imported" );

var timeSet = 60;
var userScore = 0;
var quizQuestionsArr = buildQuestionList( q1, q2, q3, q4 );
var timer = document.querySelector( "#time" );

function buildQuestionList() {
    var arr = [];
    for ( var i = 0; i < arguments.length; i++ ) {
        arr.push( arguments[ i ] );
    }
    return arr;
}

// Displays the chosen question in the DOM. Written to randomize the location of the answer. Also adds an event listener to all buttons to call itself for the next question/end of the quiz.
function displayQuestion( index ) {
    var quizQuestion = quizQuestionsArr[ index ];
    // Clear the #answer_field section div of any text or questions.
    document.querySelector( "#answer_field" ).innerHTML = "";
    console.log( quizQuestion );
    // Get the number of keys in the quizQuestion object minus 2, since we don't care about looping through the "answer" or "question" properties. Useful in case we want to add more answers in the future.
    var keysNum = Object.keys( quizQuestion ).length - 2;
    console.log( "keysNum", keysNum );
    var headerText = document.querySelector( "#header_text" );
    var answerField = document.querySelector( "#answer_field" );
    // Empty array will hold all our answers.
    var answersArray = [];

    // Put all answers in answersArray so their order can be randomized without modifying the quizQuestion object.
    for ( var i = 0; i < keysNum; i++ ) {
        answersArray.push( quizQuestion[ i ] );
    }
    console.log( "answersArray after for loop", answersArray );

    // We start on answer #1.
    var answerNum = 0;
    while ( answersArray.length > 0 ) {
        // Randomize the order in which answers appear.
        var arrIndex = Math.floor( Math.random() * answersArray.length );
        var newButton = document.createElement( "button" );
        newButton.textContent = `${ answerNum + 1 }. ${ answersArray[ arrIndex ] }`;
        newButton.setAttribute( "data-index", answersArray[ arrIndex ] );
        answerField.appendChild( newButton );
        newButton.insertAdjacentHTML('afterend', '<br>');

        // Add the event listener that handles clicks when the user "answers," and calls displayQuestion again
        newButton.addEventListener( "click", function( e ) {
            evalAnswer( e.target.getAttribute( "data-index" ) === quizQuestion.a, 15 );
            index++;
            if ( index >= quizQuestionsArr.length ) {
                console.log( `No more questions, index at ${ index }` );
            } else {
                displayQuestion( index );
            }
        });

        answersArray.splice( arrIndex, 1 );
        answerNum++;
    }

    headerText.textContent = quizQuestion.q;
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

function timerPenalty( secPen ) {
    if ( timer.textContent < 15 ) {
        timer.textContent = 0;
    } else {
        timer.textContent -= secPen;
    }
}

function evalAnswer( bool, secPen ) {
    var resultField = document.querySelector( "#question_result" );
    if ( bool ) {
        resultField.textContent = "Correct!";
        userScore++;
    } else {
        resultField.textContent = `Incorrect. You have been penalized ${ secPen } seconds.`;
        timerPenalty( secPen );
    }

    var timerInterval = setInterval( function( e ) {
        // Game over
        clearInterval( timerInterval );
        resultField.textContent = "";
    }, 2000 );

}

setTimer( timeSet );
displayQuestion( 0 );