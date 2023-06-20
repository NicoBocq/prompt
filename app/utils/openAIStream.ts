import {createParser, ParsedEvent, ReconnectInterval} from 'eventsource-parser'
import {CreateChatCompletionRequest} from 'openai'

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const url = 'https://api.openai.com/v1/chat/completions'

export async function OpenAIStream(payload: CreateChatCompletionRequest) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  let counter = 0

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return
            }
            const queue = encoder.encode(text)
            controller.enqueue(queue)
            counter++
          } catch (error) {
            controller.error(error)
          }
        }
      }
      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse)
      const {body} = res
      if (!body) {
        return
      }
      for await (const chunk of body) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })
  return stream
}
