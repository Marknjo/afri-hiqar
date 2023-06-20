import { Button } from '@mj/ui'

function Root() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-center text-2xl uppercase">Let's create</h1>
        <Button />
      </div>
    </main>
  )
}

export default Root
