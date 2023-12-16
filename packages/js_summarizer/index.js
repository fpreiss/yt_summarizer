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

const retrieve_transcript = (videoID) => {
  let transcript = ``;
  for (const part of response) {
    transcript += `${part.text.replace(/(\r\n|\n|\r)/gm, "")} `;
  }
  transcript.trim();
  return transcript;
};

const write_out_transcript = (transcript, video_out_path) => {
  const video_transcript_file_path = `${video_out_path}/transcript`;
  if (!fs.existsSync(`${video_out_path}`)) {
    fs.mkdirSync(`${video_out_path}`);
  }

  fs.writeFile(
    `${video_transcript_file_path}.json`,
    JSON.stringify(response, null, 4),
    (err) => {
      if (err) throw err;
      console.log("saved transcript to json");
    }
  );

  fs.writeFile(`${video_transcript_file_path}.txt`, transcript, (err) => {
    if (err) throw err;
    console.log("saved transcript to txt");
  });

  return null;
};

const write_out_summary = (summary, video_out_path) => {
  const video_transcript_summary_file_path = `${video_out_path}/summary`;
  fs.writeFile(`${video_transcript_summary_file_path}.txt`, summary, (err) => {
    if (err) throw err;
    console.log("saved summary to txt");
  });
};

const get_summary = async (transcript) => {
  const messages = [
    { role: "system", content: prompt },
    { role: "user", content: transcript },
  ];

  let answer = await ask4(messages);
  return answer;
};

const videoId = retrieveVideoId(
  //'https://www.youtube.com/watch?v=HNiJvrZTGsA'
  "https://www.youtube.com/watch?v=5g4xB4yjHSk"
);

const PROJECT_PATH = "./";
const INDIR = PROJECT_PATH + "../../inputs";
const OUTDIR = PROJECT_PATH + "../../outputs";
const response = await YoutubeTranscript.fetchTranscript(videoId);
const video_out_path = `${OUTDIR}/${videoId}`;

const prompt = fs.readFileSync(`${INDIR}/prompt.txt`, "utf8");

let transcript = retrieve_transcript(videoId);
write_out_transcript(transcript, video_out_path);
let summary = await get_summary(transcript);
write_out_summary(summary, video_out_path);
