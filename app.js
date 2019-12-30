const { Machine, assign } = require('xstate')
const axios = require('axios')

const invokeFetchSubreddit = context => {
  const { subreddit } = context
  return axios
    .get(`https://www.reddit/r/${subreddit}.json`)
    .then(json => json.data.children.map(child => child.data))
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
            src: invokeFetchSubreddit
          },
          onDone: {
            target: 'loaded',
            actions: assign({ posts: (context, event) => event.data })
          },
          onError: 'failed'
        },
        loaded: {},
        failed: {}
      }
    }
  },
  on: {
    SELECT: '.selected',
    actions: assign({
      subreddit: (context, event) => event.name
    })
  }
})

module.exports = {
  redditMachine
}
