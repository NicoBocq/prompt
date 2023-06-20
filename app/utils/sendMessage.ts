export const sendMessage = async (prompt: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prompt}),
    })

    return response
  } catch (error) {
    console.log(error)
  }
}
