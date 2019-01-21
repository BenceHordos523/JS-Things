//works shitty as fack, but it is working as the example project...
(function() {
  function Question(question, answers, correct) {
      this.question = question;
      this.answers = answers;
      this.correct = correct;
  }

  Question.prototype.displayQuestion = function() {
      console.log(this.question);

      for (var i = 0; i < this.answers.length; i++) {
          console.log(i + ': ' + this.answers[i]);
      }
  }

  Question.prototype.checkAnswer = function(ans, callback) {
      let score
      if (ans === this.correct) {
          console.log('Correct answer!');
          score = callback(true)
      } else {
          console.log('Wrong answer. Try again :)')
          score = callback(false)
      }

      this.displayScore(score)
  }

  Question.prototype.displayScore = function(score){
    console.log('Your current score is: ' + score);
    console.log('------------------------------');
  }

  var q1 = new Question('Is JavaScript the coolest programming language in the world?',
                        ['Yes', 'No'],
                        0);

  var q2 = new Question('What is the name of this course\'s teacher?',
                        ['John', 'Micheal', 'Jonas'],
                        2);

  var q3 = new Question('What does best describe coding?',
                        ['Boring', 'Hard', 'Fun', 'Tediuos'],
                        2);

  const questions = [q1, q2, q3];

  function calculateScore(){
    let score = 0
    return (correct) => {
      if(correct) score++
      return score
    }
  }

  let userScore = calculateScore()

  function nextQuestion(){
    var n = Math.floor(Math.random() * questions.length);

    questions[n].displayQuestion();

    var answer = prompt('Please select the correct answer.');

    if(answer !== 'exit'){
      questions[n].checkAnswer(parseInt(answer), userScore);
      nextQuestion()
    }
  }

  nextQuestion()

})();