'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = "amzn1.ask.skill.315ec71c-61e2-4c12-9cfa-0b5e274e625f";

//This function returns a descriptive sentence about your data.  Before a user starts a Test, they can ask about a specific data element,
//like "Ohio."  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item)
{
    let sentence = "Depression Test.";
    return sentence;
}

//We have provided two ways to create your Test questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item)
{
    return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of "  + item.Text + "?";

    /*
    switch(property)
    {
        case "City":
            return "Here is your " + counter + "th question.  In what city do the " + item.League + "'s "  + item.Mascot + " play?";
        break;
        case "Sport":
            return "Here is your " + counter + "th question.  What sport do the " + item.City + " " + item.Mascot + " play?";
        break;
        case "HeadCoach":
            return "Here is your " + counter + "th question.  Who is the head coach of the " + item.City + " " + item.Mascot + "?";
        break;
        default:
            return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of the "  + item.Mascot + "?";
        break;
    }
    */
}

//This is the function that returns an answer to your user during the Test.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this Test has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item)
{
    switch(property)
    {
        case "Abbreviation":
            return "The " + formatCasing(property) + " of " + item.Text + " is <say-as interpret-as='spell-out'>" + item[property] + "</say-as>. ";
        default:
            return "The " + formatCasing(property) + " of " + item.Text + " is " + item[property] + ". ";
    }
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
const speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
const speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

//This is the welcome message for when a user starts the skill without a specific intent.
const WELCOME_MESSAGE = 'Welcome. This assessment is a self-report measure of depression that was developed at Johns Hopkins.'

//This is the message a user will hear when they start a Test.
const START_TEST_MESSAGE = `Below is a list of the ways you might have felt or behaved. Please tell me how often you have felt this way during the past week.
1 = Rarely or None of the Time (Less than 1 Day)
2 = Some or a Little of the Time (1-2 Days)
3 = Occasionally or a Moderate Amount of Time (3-4 Days)
4 = Most or All of the Time (5-7 Days)`;

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a Test.
const EXIT_SKILL_MESSAGE = "Thank you for completing the Depression Test!  Come back again soon!";

//This is the message a user will hear after they ask (and hear) about a specific data element.
const REPROMPT_SPEECH = "Which other question would you like to know about?";

//This is the message a user will hear when they ask Alexa for help in your skill.
const HELP_MESSAGE = "You can measue yourself for depression by asking me to start test.  What would you like to do?";

const QUESTION_HELP_MESSAGE = "Please respond one, two, three, or four."

//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "I'm sorry. " + item + " is not a valid response. " + HELP_QUESTION_MESSAGE; }

//This is the message a user will receive after each question of a Test.  It reminds them of their current score.
function getCurrentScore(score, counter) { return "Your current score is " + score + " out of " + counter + ". "; }

//This is the message a user will receive after they complete a Test.  It tells them their final score.
function getFinalScore(score, counter) { return "Your final score is " + score + " out of " + counter + ". "; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a Test.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
const USE_CARDS_FLAG = true;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.Text;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/Test-game/state_flag/720x400/" + item.Abbreviation + "._TTH_.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/Test-game/state_flag/1200x800/" + item.Abbreviation + "._TTH_.png"; }

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================
const data = [
    {Text: "Zero" },
    {Text: "One" },
    {Text: "Two" },
    {Text: "Three" },
    {Text: "Four" }
];

const answer_data = [
                {Text: "My appetite was poor." },
                {Text: "I could not shake off the blues." },
                {Text: "I had trouble keeping my mind on what I was doing." },
                {Text: "I felt depressed." },
                {Text: "My sleep was restless." },
                {Text: "I felt sad." },
                {Text: "I could not get going." },
                {Text: "Nothing made me happy." },
                {Text: "I felt like a bad person." },
                {Text: "I lost interest in my usual activities." },
                {Text: "I slept much more than usual." },
                {Text: "I felt like I was moving too slowly." },
                {Text: "I felt fidgety." },
                {Text: "I wished I were dead." },
                {Text: "I wanted to hurt myself." },
                {Text: "I was tired all the time." },
                {Text: "I did not like myself." },
                {Text: "I lost a lot of weight without trying to." },
                {Text: "I had a lot of trouble getting to sleep." },
                {Text: "I could not focus on the important things." }
            ];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const states = {
    START: "_START",
    TEST: "_TEST"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "TestIntent": function() {
        this.handler.state = states.TEST;
        this.emitWithState("Test");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

const startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.response.speak(WELCOME_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "AnswerIntent": function() {
        let item = getItem(this.event.request.intent.slots);

        if (item && item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
          console.log("\nMEMO's TEST\n");
            if (USE_CARDS_FLAG)
            {
                let imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};

                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
                this.response.cardRenderer(getCardTitle(item), getTextDescription(item), imageObj);            }
            else
            {
                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
            }
        }
        else
        {
            this.response.speak(getBadAnswer(item)).listen(getBadAnswer(item));

        }

        this.emit(":responseReady");
    },
    "TestIntent": function() {
        this.handler.state = states.TEST;
        this.emitWithState("Test");
    },
    "AMAZON.PauseIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


const TestHandlers = Alexa.CreateStateHandler(states.TEST,{
    "Test": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["Testscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_TEST_MESSAGE + " ";
        }

        let random = getRandom(0, data.length-1);
        let item = data[random];

        let propertyArray = Object.getOwnPropertyNames(item);
        let property = propertyArray[getRandom(1, propertyArray.length-1)];

        this.attributes["Testitem"] = item;
        this.attributes["Testproperty"] = property;
        this.attributes["counter"]++;

        let question = getQuestion(this.attributes["counter"], property, item);
        let speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        let response = "";
        let speechOutput = "";
        let item = this.attributes["Testitem"];
        let property = this.attributes["Testproperty"];

        let correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["Testscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["Testscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["Testscore"], this.attributes["counter"]);
            speechOutput = response + " " + EXIT_SKILL_MESSAGE;

            this.response.speak(speechOutput);
            this.emit(":responseReady");
        }
    },
    "AMAZON.RepeatIntent": function() {
        let question = getQuestion(this.attributes["counter"], this.attributes["Testproperty"], this.attributes["Testitem"]);
        this.response.speak(question).listen(question);
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Test");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.PauseIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (let slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getItem(slots)
{
    let propertyArray = Object.getOwnPropertyNames(data[0]);
    let value;

    for (let slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (let property in propertyArray)
            {
                let item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{

    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    let text = "";

    for (let key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, TestHandlers);
    alexa.execute();
};