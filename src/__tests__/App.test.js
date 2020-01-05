import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'

test('renders learn react link', () => {
  const { getByText } = render(<App />)
  const selectElement = getByText(/frontend/i)
  expect(selectElement).toBeInTheDocument()
})
