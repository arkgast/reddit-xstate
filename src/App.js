import React from 'react'
import { useMachine } from '@xstate/react'
import redditMachine from './machines/reddit-machine'
import Subreddit from './Subreddit'

const subreddits = ['frontend', 'reactjs', 'vuejs']

function App () {
  const [current, send] = useMachine(redditMachine)
  const { subreddit } = current.context

  const handleSelect = event => {
    const { value } = event.target
    send('SELECT', { name: value })
  }

  return (
    <main
      data-machine={redditMachine.id}
      data-state={current.toStrings().join(' ')}
    >
      <header>
        <select onChange={handleSelect}>
          {subreddits.map(subreddit => (
            <option key={subreddit}>{subreddit}</option>
          ))}
        </select>
      </header>
      {subreddit && <Subreddit service={subreddit} key={subreddit.id} />}
    </main>
  )
}

export default App
