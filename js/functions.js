// Initial time remaining.
var timeSet = 60;
var userScore = 0;
var highScores = JSON.parse( localStorage.getItem( "highScores" ) ) || [];
var gameOn = false;

// Create the array of questions that we will iterate over to generate the quiz.
const quizQuestionsArr = buildQuestionList( q1, q2, q3, q4 );

// Constants hold all selectors for necessary HTML elements.
const headerText = document.querySelector( "#header_text" );
const answerField = document.querySelector( "#answer_field" );
const resultField = document.querySelector( "#question_result" );
const timerSection = document.querySelector( "#timer_sec" );
const timer = document.querySelector( "#time" );

// Builds the array of questions which must be iterated over to execute the quiz.
function buildQuestionList() {
    var arr = [];
    for ( var i = 0; i < arguments.length; i++ ) {
        arr.push( arguments[ i ] );
    }
    return arr;
}

function mainMenu() {
    userScore = 0;
    headerText.textContent = "Epic Quiz Challenge 2020!";
    answerField.textContent = "";

    var quizDescription = document.createElement( "p" );
    var startQuizButton = document.createElement( "button" );
    
    quizDescription.textContent = "It's a quiz! Answer questions in the time remaining in the top right. Once you're done, you can see your high score and try to beat it! Good luck.";
    startQuizButton.textContent = "Let's do this!";

    answerField.appendChild( quizDescription );
    answerField.appendChild( startQuizButton );

    startQuizButton.addEventListener( "click", function() {
        gameOn = true;
        setTimer( timeSet );
        displayQuestion( 0 );
    });
}

// Displays the chosen question in the DOM. Written to randomize the location of the answer. Also adds an event listener to all buttons to call itself for the next question/end of the quiz.
function displayQuestion( index ) {
    var quizQuestion = quizQuestionsArr[ index ];
    // Clear the #answer_field section div of any text or questions.
    answerField.innerHTML = "";
    // Get the number of keys in the quizQuestion object minus 2, since we don't care about looping through the "answer" or "question" properties. Useful in case we want to add more answers in the future.
    var keysNum = Object.keys( quizQuestion ).length - 2;
    // Empty array will hold all our answers.
    var answersArray = [];

    // Put all answers in answersArray so their order can be randomized without modifying the quizQuestion object.
    for ( var i = 0; i < keysNum; i++ ) {
        answersArray.push( quizQuestion[ i ] );
    }

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
                displayEndPage();
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
    timerSection.style.display = "block";
    timer.textContent = timeSet;

    var timerInterval = setInterval( function() {
        timer.textContent -= 1;
        if ( timer.textContent <= 0 ) {
            gameOn = false;
            addTemporaryMessage( resultField, "Game over. The timer has run out.", 3000 );
        }
        if ( !gameOn ) {
            timerSection.style.display = "none";
            timer.textContent = 0;
            displayEndPage();
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
    var evalMessage;
    if ( bool ) {
        evalMessage = "Correct!";
        userScore++;
    } else {
        evalMessage = `Incorrect. You have been penalized ${ secPen } seconds.`;
        timerPenalty( secPen );
    }

    addTemporaryMessage( resultField, evalMessage, 2000 );
}

function displayEndPage() {
    gameOn = false;
    headerText.textContent = "All done!";
    answerField.innerHTML = `Your final score is ${ userScore }. <br>`;

    // Create input and label.
    var enterInitialsForm = document.createElement( "form" );
    var enterInitialsLabel = document.createElement( "label" );
    var enterInitialsInput = document.createElement( "input" );
    var enterInitialsSubmit = document.createElement( "button" );
    var lineBreak = document.createElement( "br" );
    var playAgainButton = document.createElement( "button" );

    // Add attributes.
    enterInitialsForm.id = "enter-initials-form";
    enterInitialsForm.method = "POST";
    enterInitialsLabel.for = "enter";
    enterInitialsLabel.textContent = "Enter your name or initials: ";
    enterInitialsInput.type = "text";
    enterInitialsInput.name = "enter-initials";
    enterInitialsInput.id = "enter-initials";
    enterInitialsSubmit.id = "submit-initials";
    enterInitialsSubmit.textContent = "Submit Score";
    playAgainButton.textContent = "Play Again!";
    // timerSection.style.display = "none";

    // Add all elements to answerField div.
    answerField.appendChild( enterInitialsForm );
    enterInitialsForm.appendChild( enterInitialsLabel );
    enterInitialsForm.appendChild( enterInitialsInput );
    enterInitialsForm.appendChild( enterInitialsSubmit );
    enterInitialsForm.appendChild( lineBreak );
    answerField.appendChild( playAgainButton );

    enterInitialsForm.addEventListener( "submit", function( event ) {
        event.preventDefault();

        var enterInitials = document.querySelector( "#enter-initials" );
        var userInitials = enterInitials.value;
        if ( userInitials ) {
            enterInitials.value = "";
            var index = 0;

            while ( highScores[ index ] && highScores[ index ][ 1 ] > userScore ) {
                index++;
            }

            highScores.splice( index, 0, [ userInitials, userScore ] );

            localStorage.setItem( "highScores", JSON.stringify( highScores ) );
            highScoresPage();

            var scoreSubmitted = "Score Submitted!";
            addTemporaryMessage( resultField, scoreSubmitted, 2000 );
        }
    });

    playAgainButton.addEventListener( "click", function() {
        mainMenu();
    });
}

function highScoresPage() {
    headerText.textContent = "Top 10 High Scores";
    answerField.textContent = "";
    var tenOrLess;
    var playAgainButton = document.createElement( "button" );
    var clearScoresButton = document.createElement( "button" );
    var highScoresTable = document.createElement( "table" );
    
    highScoresTable.setAttribute( "id", "high-scores-table" );
    answerField.appendChild( highScoresTable );

    if ( highScores.length > 10 ) {
        tenOrLess = 10;
    } else {
        tenOrLess = highScores.length;
    }
    for ( var i = 0; i < tenOrLess; i++ ) {
        var row = document.createElement( "tr" );
        highScoresTable.appendChild( row );

        var place = document.createElement( "td" );
        var name = document.createElement( "td" );
        var score = document.createElement( "td" );
        place.textContent = i + 1;
        name.textContent = highScores[ i ][ 0 ];
        score.textContent = highScores[ i ][ 1 ];
        row.appendChild( place );
        row.appendChild( name );
        row.appendChild( score );
    }

    playAgainButton.textContent = "Play Again!";
    clearScoresButton.textContent = "Clear Scores";
    answerField.appendChild( playAgainButton );
    answerField.appendChild( clearScoresButton );

    playAgainButton.addEventListener( "click", function() {
        mainMenu();
    });

    clearScoresButton.addEventListener( "click", function() {
        localStorage.removeItem( "highScores" );
        highScoresTable.textContent = "";
    });
}

// Creates a temporary message to be displayed within a <p> tag inside a target element.
function addTemporaryMessage( parent, message, ttl ) {
    var messageTag = document.createElement( "p" );
    messageTag.setAttribute( "class", "temp-message" );
    messageTag.textContent = message;
    parent.appendChild( messageTag );
    var timerInterval = setInterval( function( e ) {
        clearInterval( timerInterval );
        messageTag.remove();
    }, ttl );
}

mainMenu();