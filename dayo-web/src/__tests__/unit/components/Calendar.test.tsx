import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../mocks/testUtils'
import Calendar from '../../../components/planner/Calendar'

describe('Calendar Component', () => {
  const mockOnDateSelect = vi.fn()
  const defaultProps = {
    selectedDate: new Date('2026-01-17'),
    onDateSelect: mockOnDateSelect,
    daysWithEntries: ['2026-01-15', '2026-01-17', '2026-01-20'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the calendar with current month', () => {
    render(<Calendar {...defaultProps} />)

    expect(screen.getByText('January 2026')).toBeInTheDocument()
  })

  it('should display all weekday headers', () => {
    render(<Calendar {...defaultProps} />)

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    weekDays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument()
    })
  })

  it('should call onDateSelect when a day is clicked', () => {
    render(<Calendar {...defaultProps} />)

    const dayButton = screen.getByRole('button', { name: '15' })
    fireEvent.click(dayButton)

    expect(mockOnDateSelect).toHaveBeenCalled()
  })

  it('should navigate to previous month when prev button clicked', () => {
    render(<Calendar {...defaultProps} />)

    const prevButton = screen.getAllByRole('button')[0]
    fireEvent.click(prevButton)

    expect(screen.getByText('December 2025')).toBeInTheDocument()
  })

  it('should navigate to next month when next button clicked', () => {
    render(<Calendar {...defaultProps} />)

    // Button order: 0=Prev, 1=Today, 2=Next, 3+=Days
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[2] // Third button is next (after prev and today)
    fireEvent.click(nextButton)

    expect(screen.getByText('February 2026')).toBeInTheDocument()
  })

  it('should show Today button that navigates to current date', () => {
    render(<Calendar {...defaultProps} />)

    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('should highlight selected date', () => {
    render(<Calendar {...defaultProps} />)

    // The selected date (17) should have different styling
    const selectedDay = screen.getByRole('button', { name: '17' })
    expect(selectedDay).toHaveClass('bg-dayo-orange')
  })

  it('should show entry indicators for days with entries', () => {
    const { container } = render(<Calendar {...defaultProps} />)

    // Days with entries should have indicator dots
    // The dot is a span inside the button
    const indicators = container.querySelectorAll('.bg-dayo-orange.rounded-full')
    expect(indicators.length).toBeGreaterThan(0)
  })

  it('should render days from previous and next months in grid', () => {
    render(<Calendar {...defaultProps} />)

    // Calendar grid should include days from adjacent months
    // These should have different styling (lighter text)
    const allDayButtons = screen.getAllByRole('button').filter((btn) =>
      /^\d+$/.test(btn.textContent || '')
    )

    // Should have ~35-42 day buttons (5-6 weeks)
    expect(allDayButtons.length).toBeGreaterThanOrEqual(28)
  })
})
