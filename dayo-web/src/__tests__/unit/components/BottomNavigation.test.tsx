import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import BottomNavigation from '../../../components/ui/BottomNavigation'

// Helper component to check location
function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

describe('BottomNavigation Component', () => {
  const renderWithRouter = (initialRoute = '/today') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <BottomNavigation />
        <LocationDisplay />
      </MemoryRouter>
    )
  }

  it('should render all navigation items', () => {
    renderWithRouter()

    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('Diary')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should highlight active route', () => {
    renderWithRouter('/today')

    const todayButton = screen.getByText('Today').closest('button')
    expect(todayButton).toHaveClass('active')
  })

  it('should highlight calendar when on calendar page', () => {
    renderWithRouter('/calendar')

    const calendarButton = screen.getByText('Calendar').closest('button')
    expect(calendarButton).toHaveClass('active')
  })

  it('should navigate to correct routes on click', () => {
    renderWithRouter('/today')

    fireEvent.click(screen.getByText('Calendar'))
    expect(screen.getByTestId('location')).toHaveTextContent('/calendar')

    fireEvent.click(screen.getByText('AI'))
    expect(screen.getByTestId('location')).toHaveTextContent('/ai')

    fireEvent.click(screen.getByText('Goals'))
    expect(screen.getByTestId('location')).toHaveTextContent('/goals')

    fireEvent.click(screen.getByText('Settings'))
    expect(screen.getByTestId('location')).toHaveTextContent('/settings')
  })

  it('should have correct number of navigation items', () => {
    renderWithRouter()

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(6)
  })

  it('should render icons for each nav item', () => {
    const { container } = renderWithRouter()

    // Each button should contain an SVG icon
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(6)
  })
})
