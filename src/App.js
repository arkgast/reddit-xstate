import React from 'react'
import { useMachine } from '@xstate/react'
import { redditMachine } from './redditMachine'

const subreddits = ['frontend', 'reactjs', 'vuejs']

function App () {
  const [current, send] = useMachine(redditMachine)
  const { subreddit, posts } = current.context

  const handleSelect = event => {
    const { value } = event.target
    send('SELECT', { name: value })
  }

  return (
    <main>
      <header>
        <select onChange={handleSelect}>
          {subreddits.map(subreddit => (
            <option key={subreddit}>{subreddit}</option>
          ))}
        </select>
      </header>
      <section>
        <h1>{current.matches('idle') ? 'Select a subreddit' : subreddit}</h1>
        {current.matches({ selected: 'loading' }) && <div>Loading ...</div>}
        {current.matches({ selected: 'loaded' }) && (
          <ul>
            {posts.map(post => (
              <li key={post.title}>{post.title}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
