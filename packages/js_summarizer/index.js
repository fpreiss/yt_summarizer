import { YoutubeTranscript } from "youtube-transcript";
import fs from "fs";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ask4 = async (messages, config = {}) => {
  if (config?.format === "json") {
    config.model = "gpt-4-1106-preview";
    config.response_format = { type: "json_object" };
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    ...config,
  });
  let response = completion.choices[0].message.content;

  if (config?.format === "json") {
    response = JSON.parse(response) ?? response;
  }

  return response;
};

const retrieveVideoId = (videoId) => {
  if (videoId.length === 11) {
    return videoId;
  }
  const RE_YOUTUBE =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  let matchId = videoId.match(RE_YOUTUBE);
  if (matchId && matchId.length) {
    return matchId[1];
  }

  return videoId;
};

const videoId = retrieveVideoId(
  //'https://www.youtube.com/watch?v=HNiJvrZTGsA'
  "https://www.youtube.com/watch?v=5g4xB4yjHSk"
);

const response = await YoutubeTranscript.fetchTranscript(videoId);

console.log(response);

let transcript = ``;
for (const part of response) {
  transcript += `${part.text.replace(/(\r\n|\n|\r)/gm, "")} `;
}

transcript.trim();

//console.log(transcript);

if (!fs.existsSync(`./${videoId}`)) {
  fs.mkdirSync(`./${videoId}`);
}

/*fs.writeFile(
	`./${videoId}/transcript.json`,
	JSON.stringify(response, null, 4),
	(err) => {
		if (err) throw err;
		console.log('saved transcript to json');
	}
);*/

fs.writeFile(`./${videoId}/transcript.txt`, transcript, (err) => {
  if (err) throw err;
  console.log("saved transcript to txt");
});

const system = `Du sollst Youtube Transcripts kurz und verständlich zusammenfassen und auf das wesentliche reduzieren.`;
const prompt = `Fasse mir das folgende Transcript zusammmen:`;

const messages = [
  { role: "system", content: system },
  { role: "user", content: prompt },
  { role: "user", content: transcript },
];

let answer = await ask4(messages);
console.log(answer);

fs.writeFile(`./${videoId}/answer.txt`, answer, (err) => {
  if (err) throw err;
  console.log("saved answer to txt");
});
