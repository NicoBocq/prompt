import './globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html className="h-full antialiased" lang="en">
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black">
        {children}
      </body>
    </html>
  )
}

export default RootLayout
