import { Machine, assign } from 'xstate'
import axios from 'axios'

const invokeFetchSubreddit = context => {
  const { subreddit } = context
  return axios
    .get(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.data.data.children.map(child => child.data))
}

const createSubredditMachine = subreddit => {
  return Machine({
    id: `subreddit-${subreddit}`,
    initial: 'loading',
    context: {
      subreddit,
      posts: null,
      lastUpdated: null
    },
    states: {
      loading: {
        invoke: {
          id: 'fetch-subreddit',
          src: invokeFetchSubreddit,
          onDone: {
            target: 'loaded',
            actions: assign({
              posts: (_, event) => event.data,
              lastUpdated: () => Date.now()
            })
          },
          onError: 'failure'
        }
      },
      loaded: {
        on: {
          REFRESH: 'loading'
        }
      },
      failure: {
        on: {
          RETRY: 'loading'
        }
      }
    }
  })
}

export default createSubredditMachine
