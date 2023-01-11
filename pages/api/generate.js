import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Write me a detailed table of contents for a blog post with the title below.

Title:
`;
const generateAction = async (req, res) => {
  // build prompt #1
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.7,
    max_tokens: 750,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // build prompt #2
  // TODO: whats my second prompt?
  const secondPrompt = `
  Take the table of contents and title of the blog post below and generate a 1,000 word blog post written in the style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Blog Post:
  `;

  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    temperature: 0.8,
    max_tokens: 1250,
  });

  // 2nd prompt output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({
    // output: basePromptOutput,
    output: secondPromptOutput,
  });
};

export default generateAction;
