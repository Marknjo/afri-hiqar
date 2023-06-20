import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import HelloWorld from './HelloWorld'

describe('tests', () => {
  it('should render a component', () => {
    const displayText = 'Hello There!'
    render(<HelloWorld />)
    expect(screen.queryByText(displayText)).toBeDefined()
  })
})
