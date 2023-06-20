'use client'

import {Inter} from 'next/font/google'
import {useState, ChangeEvent} from 'react'
import {ChatCompletionRequestMessage} from 'openai'
import {sendMessage} from './utils/sendMessage'
import clsx from 'clsx'
import Prose from './components/Prose'

function Item({item}: {item: ChatCompletionRequestMessage}) {
  if (item.role === 'user') {
    return <Prose className="bg-blue-200">{item.content}</Prose>
  } else {
    return <Prose>{item.content}</Prose>
  }
}

function transformToPreCode(textContent: string) {
  const regex = /```/g
  const preCodeStart = '<pre>'
  const preCodeEnd = '</pre>'

  const replacedText = textContent
    .replace(regex, preCodeStart)
    .replace(regex, preCodeEnd)

  return replacedText
}

function Home() {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [stream, setStream] = useState('')

  const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value)
  }

  const addMessage = async () => {
    setIsLoading(true)
    try {
      setCode(prompt)
      setPrompt('')
      setStream('')
      const response = await sendMessage(prompt)
      const data = response?.body
      if (!data) {
        return
      }
      const reader = data.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      while (!done) {
        const {value, done: doneReading} = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        console.log(chunkValue)
        setStream((prev) => prev + chunkValue)
        // setMessages([...messages, userMessage, newMessage])
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex h-full w-full bg-gray-100 p-4">
      <div className="w-1/2 flex-col items-center border border-r-gray-600 p-4">
        {isLoading && <div>Loading...</div>}
        <input
          type="text"
          onChange={handlePromptChange}
          value={prompt}
          placeholder="Type your code here..."
          className="h-26 w-full border border-gray-400 p-4 placeholder:text-gray-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addMessage()
            }
          }}
        />
        {/* <button onClick={addMessage} className="bg-gray-200">
            Submit
          </button> */}
        <div className="border border-gray-600">{prompt}</div>
      </div>
      <div className="h-full w-1/2 overflow-y-scroll p-4">
        <Prose>{stream}</Prose>
        {/* {messages.map((item, index) => (
          <Item item={item} key={index} />
        ))} */}
      </div>
      {/* <div
        className="prose border border-t-red-500 bg-white"
        dangerouslySetInnerHTML={{__html: transformToPreCode(code)}}
      /> */}
    </main>
  )
}

export default Home
