# Youtube Summarizer

Create AI generated summaries from the transcript of Youtube videos using ChatGPT.

There are too many videos to watch them all, why not provide a list of videos
you care about but not enough to watch and just read what actually matters to you.

## Features

* Modifiable system prompt `inputs/prompt.txt` (to specify how ChatGPT should proceed)
* Batch process multiple videos from file (`inputs/video_urls.txt`)

## Getting Started

Install the required dependencies:

```bash
cd packages/js_summarizer
npm install
```

Provide an API token for ChatGPT by creating an environment file `packages/js_summarizer/.env`:

```bash
OPENAI_API_KEY="<your_api_key>"
```

Run the summarizer:

```bash
cd packages/js_summarizer
npm run once
```

The summarized videos and transcripts will then be created in the `ouptuts` directory
under the `VideoId` for the respective Youtube video.

```text
├── inputs
│   ├── prompt.txt
│   └── video_urls.txt
├── outputs
│   ├── 4o5hSxvN_-s
│   │   ├── summary.txt
│   │   └── transcript.txt
│   ├── HNiJvrZTGsA
│   │   └── ...
│   └── ...
└── ...
```

## Notes

* This repository was created to toy around with the ChatGPT APIs in half a day
  during the
  [Generative AI Hackathon](https://www.startplatz.de/event/hackathon-code-and-create-DE/?app=813765).
  and is therefore very much experimental
* If the time allows for it, I want to code this from scratch in python.
* I have many things in mind that could make this a useful productivity tool.
  If you are interested in an actual software solution, I'm open for collaborations.
