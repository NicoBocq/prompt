import {OpenAIStream} from '@/app/utils/openAIStream'
import {CreateChatCompletionRequest} from 'openai'

type RequestData = {
  prompt: string
}

export const runtime = 'edge'

export async function POST(req: Request) {
  const {prompt} = (await req.json()) as RequestData

  const content = `You must act as a senior developer code reviewer, do not hesitate to share code improvements. Here is the code you are reviewing: ${prompt}`
  const payload: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content}],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  }
  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
