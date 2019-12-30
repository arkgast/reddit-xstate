const { Machine, assign } = require('xstate')
const axios = require('axios')

const invokeFetchSubreddit = context => {
  const { subreddit } = context
  return axios
    .get(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.data.data.children.map(child => child.data))
}

const redditMachine = Machine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
    posts: null
  },
  states: {
    idle: {},
    selected: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            id: 'fetch-subreddit',
            src: invokeFetchSubreddit,
            onDone: {
              target: 'loaded',
              actions: assign({ posts: (context, event) => event.data })
            },
            onError: 'failed'
          }
        },
        loaded: {},
        failed: {}
      }
    }
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        subreddit: (context, event) => event.name
      })
    }
  }
})

module.exports = {
  redditMachine
}
