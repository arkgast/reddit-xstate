import { interpret } from 'xstate'
import { redditMachine } from '../redditMachine'

describe('reddit machine (live)', () => {
  it('should load posts of a selected subreddit', done => {
    const redditService = interpret(redditMachine)
      .onTransition(state => {
        if (state.matches({ selected: 'loaded' })) {
          expect(state.context.posts).not.toBeEmpty()
          done()
        }
      })
      .start()

    redditService.send('SELECT', { name: 'reactjs' })
  })
})
