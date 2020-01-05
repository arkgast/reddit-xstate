import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useMachine } from '@xstate/react'
import createSubredditMachine from './machines/sub-reddit-machine'

const Subreddit = ({ name }) => {
  const subredditMachine = useMemo(() => {
    console.log({ name })
    return createSubredditMachine(name)
  }, [name])

  const [current, send] = useMachine(subredditMachine)

  if (current.matches('failure')) {
    return (
      <div>
        Failed to load post.{' '}
        <button onClick={() => send('RETRY')}>Retry?</button>
      </div>
    )
  }

  const { subreddit, posts, lastUpdated } = current.context

  return (
    <section data-machine={subredditMachine.id} data-state={current.toString()}>
      {current.matches('loading') && <div>Loading...</div>}
      {posts && (
        <>
          <header>
            <h2>{subreddit}</h2>
            <small>
              Last updated: {lastUpdated}{' '}
              <button onClick={() => send('REFRESH')}>Refresh</button>
            </small>
          </header>
          <ul>
            {posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

Subreddit.propTypes = {
  name: PropTypes.string
}

export default Subreddit
