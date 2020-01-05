import { interpret } from 'xstate'
import redditMachine from '../machines/reddit-machine'

describe('reddit machine (live)', () => {
  it('should load posts of a selected subreddit', done => {
    const redditService = interpret(redditMachine)
      .onTransition(state => {
        if (state.matches('selected')) {
          done()
        }
      })
      .start()

    redditService.send('SELECT', { name: 'reactjs' })
  })
})
