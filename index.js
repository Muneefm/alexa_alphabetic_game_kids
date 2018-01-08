/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.f423269b-816c-4d78-b588-f4da713e4ceb';

const SKILL_NAME = 'Alphabet Game';
const GET_FACT_MESSAGE = "playing  ";
const HELP_MESSAGE = 'You can say open  machine for me to , or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'This is simple phonics game i will say a letter,  you just have to say a word that starts with this letter, like A for apple, B for cat,';
const STOP_MESSAGE = 'Goodbye! see you soon!';
const LOOP_ON_MESSAGE = 'Loop turned on!';
const LOOP_OFF_MESSAGE = 'Loop turned off!';
const GIVE_US_RATING ='if you had a good time With this skill, please dont forget to rate us 5 star, it would help us improve, \n search "Alphabet Game" in skill section to find us. '
const WELCOM_MESSAGE = " This is simple phonics game, i will say a letter,  you just have to say a word that starts with this letter, like A for apple, B for cat,"


const RIVER_URL = 'https://s3.amazonaws.com/aws-website-muneef-1lay4/river.mp3';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================
const questions = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',

];


//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.f423269b-816c-4d78-b588-f4da713e4ceb';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {

   
    'LaunchRequest': function () {
    

      
      console.log('LaunchRequest console log  !');

      const gameQuestionRandom = populateQuestions(questions);
        const currentQuestionIndex = 0;
        const realIndexQuestionArray = gameQuestionRandom[currentQuestionIndex];
        const currentQuestion = questions[realIndexQuestionArray];
        this.attributes['realIndexQuestionArray'] = realIndexQuestionArray;
        this.attributes['currentQuestionIndex'] = currentQuestionIndex;
        this.attributes['gameQuestionRandom'] = gameQuestionRandom;


        console.log("current question = "+currentQuestion);


      this.emit(':ask', "Hi there"+WELCOM_MESSAGE+", ok lets play now,  <emphasis level=\"strong\">"+currentQuestion+"</emphasis> for ?");


    },
   
    'Answer': function(){
        console.log('Answer intent !');
        var val = this.event.request.intent.slots.ans.value;
        console.log("value = "+val);
        var answerStatus = '';
        if(val.charAt(0)==questions[this.attributes.realIndexQuestionArray]){
            console.log('Answer is correct !');
            answerStatus = 'Answer is correct !';
        }else{
            answerStatus = 'Answer is Wrong !';

        }
        answerStatus += 'lets try again';

   
        const nextQue = getQuestionString.call(this);
        this.response.speak(answerStatus +"  <break time=\"1s\"/><emphasis level=\"strong\">"+"  "+nextQue+"</emphasis> for ? ").listen("<emphasis level=\"strong\">"+nextQue+"</emphasis> for ? ");
        this.emit(':responseReady');


    },
    'DontKnow': function(){
           // this.response.speak('I don\'t know');
           //this.emit(':responseReady')
        console.log("i dont know intent");
            const pre = 'it\'s alright, lets try another one ';
            const question = getQuestionString(this);
            this.response.speak(pre +"  <break time=\"1s\"/><emphasis level=\"strong\">"+"  "+question+"</emphasis> for ? ").listen("<emphasis level=\"strong\">"+question+"</emphasis> for ? ");
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function(){
        this.response.speak('Bye bye.  see you soon');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function(){
        console.log("help intent called");
        this.response.speak(WELCOM_MESSAGE+" to start playing say Start Game!").listen("to start playing say Start");
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function(){
        this.response.speak('Bye bye.  see you soon');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function(){
        this.response.speak('Bye bye.  see you soon');
        this.emit(':responseReady');
    },
    'Start': function(){
        console.log('start intent called');
        console.log('LaunchRequest console log  !');

        const gameQuestionRandom = populateQuestions(questions);
          const currentQuestionIndex = 0;
          const realIndexQuestionArray = gameQuestionRandom[currentQuestionIndex];
          const currentQuestion = questions[realIndexQuestionArray];
          this.attributes['realIndexQuestionArray'] = realIndexQuestionArray;
          this.attributes['currentQuestionIndex'] = currentQuestionIndex;
          this.attributes['gameQuestionRandom'] = gameQuestionRandom;
          this.emit(':ask', "  Lets play now,  <emphasis level=\"strong\">"+currentQuestion+"</emphasis> for ?");

    }
    
};

function getQuestionString(){
    if(this.attributes.currentQuestionIndex >= questions.length-1){
        this.attributes['currentQuestionIndex'] = -1;
    }

const gameQuestionRandomIndex = this.attributes.gameQuestionRandom;
const nextQuestionIndex = gameQuestionRandomIndex[++this.attributes.currentQuestionIndex];
const nextQuestion = questions[nextQuestionIndex];
this.attributes['realIndexQuestionArray'] = nextQuestionIndex;
return nextQuestion;
}


function populateQuestions(questions){
    const gameQuestions = [];
    const indexList = [];
    let index = questions.length;

    for (let i = 0; i<questions.length; i++){
        indexList.push(i);
    }
    for (let j = 0; j < questions.length; j++) {
        const rand = Math.floor(Math.random() * index);
        index -= 1;

        const temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }
    return gameQuestions;


}
