import { YoutubeTranscript } from 'youtube-transcript';
import { OpenAI } from 'openai';

// https://platform.openai.com/docs/api-reference/chat
const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});


const ask4 = async (messages, config = {}) => {
if (config?.format === 'json') {
config.model = 'gpt-4-1106-preview';
// gpt-3.5-turbo-1106
config.response_format = { type: 'json_object' };
}


const completion = await openai.chat.completions.create({
    model: 'gpt-4',
messages,
...config,
});
let response = completion.choices[0].message.content;


if (config?.format === 'json') {
response = JSON.parse(response) ?? response;
}


return response;
};


const response = await YoutubeTranscript.fetchTranscript(
'https://www.youtube.com/watch?v=5g4xB4yjHSk'
);


console.log(response);


let transcript = ``;
for (const part of response) {
transcript += `${part.text.replace(/(\r\n|\n|\r)/gm, '')} `;
}


transcript.trim();


//console.log(transcript);


const system = `Du sollst Youtube Transcripts kurz und verständlich zusammenfassen und auf das wesentliche reduzieren.`;
const prompt = `Fasse mir das folgende Transcript zusammmen:`;


const messages = [
{ role: 'system', content: system },
{ role: 'user', content: prompt },
{ role: 'user', content: transcript },
];


let answer = await ask4(messages);
console.log(answer);