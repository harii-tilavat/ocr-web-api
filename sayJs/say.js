const say = require('say');
const fs = require('fs');

// Function to convert text to speech and save it as an MP3 file
function textToMP3(text, outputFile) {
    // Using say.speak with a callback to ensure it's finished before writing to a file
    say.export(text, null, null, outputFile, (err) => {
        if (err) console.error(err);
        console.log("voice specking");
    })
}

// Example usage
const text = 'Transform user research with GetCurious. Obtain faster, deeper human insights with our platform for qualitative research, prototyping feedback, and participant interviews. Experience 10x speed in participant recruitment and insight generation. All your research needs catered with our diverse 1 million+ participant panel';
const outputFile = './voices/test.mp3';

textToMP3(text, outputFile);
