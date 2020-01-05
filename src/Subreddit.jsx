import React from 'react'
import PropTypes from 'prop-types'
import { useService } from '@xstate/react'

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long'
})

const Subreddit = ({ service }) => {
  const [current, send] = useService(service)

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
    <section
      data-machine={service.machine.id}
      data-state={current.toStrings().join(' ')}
    >
      {current.matches('loading') && <div>Loading...</div>}
      {posts && (
        <>
          <header>
            <h2>{subreddit}</h2>
            <small>
              Last updated: {dateTimeFormat.format(lastUpdated)}{' '}
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
  service: PropTypes.any
}

export default Subreddit
