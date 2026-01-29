import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import KidsTaskItem, { KidsAddTaskInput } from '../TaskItem'

describe('KidsTaskItem', () => {
  const defaultProps = {
    id: 'task-1',
    title: 'Do homework',
    completed: false,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rendering', () => {
    it('should render task title', () => {
      render(<KidsTaskItem {...defaultProps} />)
      expect(screen.getByText('Do homework')).toBeInTheDocument()
    })

    it('should render checkbox button', () => {
      render(<KidsTaskItem {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(1)
    })

    it('should render delete button', () => {
      render(<KidsTaskItem {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2) // checkbox + delete
    })
  })

  describe('completion', () => {
    it('should call onToggle when checkbox is clicked', () => {
      const onToggle = vi.fn()
      render(<KidsTaskItem {...defaultProps} onToggle={onToggle} />)

      const checkbox = screen.getAllByRole('button')[0]
      fireEvent.click(checkbox)

      expect(onToggle).toHaveBeenCalledWith('task-1', false)
    })

    it('should show sticker for completed tasks', () => {
      render(<KidsTaskItem {...defaultProps} completed />)

      // Completed tasks show a sticker
      const { container } = render(<KidsTaskItem {...defaultProps} completed />)
      const sticker = container.querySelector('.text-2xl')
      expect(sticker).toBeInTheDocument()
    })

    it('should apply strikethrough to completed task title', () => {
      render(<KidsTaskItem {...defaultProps} completed />)
      const title = screen.getByText('Do homework')
      expect(title).toHaveClass('line-through')
    })

    it('should show celebration animation when completing a task', async () => {
      const onToggle = vi.fn()
      const { container } = render(<KidsTaskItem {...defaultProps} onToggle={onToggle} />)

      const checkbox = screen.getAllByRole('button')[0]
      fireEvent.click(checkbox)

      // Should show animated sticker
      expect(container.querySelector('.animate-pop')).toBeInTheDocument()

      // Animation should disappear after 1.5 seconds
      await act(async () => {
        vi.advanceTimersByTime(1500)
      })

      expect(container.querySelector('.animate-pop')).not.toBeInTheDocument()
    })
  })

  describe('deletion', () => {
    it('should call onDelete when delete button is clicked', () => {
      const onDelete = vi.fn()
      render(<KidsTaskItem {...defaultProps} onDelete={onDelete} />)

      const deleteButton = screen.getAllByRole('button')[1]
      fireEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith('task-1')
    })
  })
})

describe('KidsAddTaskInput', () => {
  const defaultProps = {
    onAddTask: vi.fn(),
    isLoading: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render input with placeholder', () => {
      render(<KidsAddTaskInput {...defaultProps} />)
      expect(screen.getByPlaceholderText('Add a new adventure...')).toBeInTheDocument()
    })

    it('should render add button', () => {
      render(<KidsAddTaskInput {...defaultProps} />)
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call onAddTask with trimmed title on submit', () => {
      const onAddTask = vi.fn()
      render(<KidsAddTaskInput {...defaultProps} onAddTask={onAddTask} />)

      const input = screen.getByPlaceholderText('Add a new adventure...')
      fireEvent.change(input, { target: { value: '  New task  ' } })
      fireEvent.submit(input.closest('form')!)

      expect(onAddTask).toHaveBeenCalledWith('New task')
    })

    it('should clear input after submission', () => {
      const onAddTask = vi.fn()
      render(<KidsAddTaskInput {...defaultProps} onAddTask={onAddTask} />)

      const input = screen.getByPlaceholderText('Add a new adventure...')
      fireEvent.change(input, { target: { value: 'New task' } })
      fireEvent.submit(input.closest('form')!)

      expect(input).toHaveValue('')
    })

    it('should not submit empty input', () => {
      const onAddTask = vi.fn()
      render(<KidsAddTaskInput {...defaultProps} onAddTask={onAddTask} />)

      const form = screen.getByRole('button', { name: /add/i }).closest('form')!
      fireEvent.submit(form)

      expect(onAddTask).not.toHaveBeenCalled()
    })

    it('should not submit whitespace-only input', () => {
      const onAddTask = vi.fn()
      render(<KidsAddTaskInput {...defaultProps} onAddTask={onAddTask} />)

      const input = screen.getByPlaceholderText('Add a new adventure...')
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.submit(input.closest('form')!)

      expect(onAddTask).not.toHaveBeenCalled()
    })
  })

  describe('loading state', () => {
    it('should disable button when loading', () => {
      render(<KidsAddTaskInput {...defaultProps} isLoading />)
      expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
    })

    it('should not submit when loading', () => {
      const onAddTask = vi.fn()
      render(<KidsAddTaskInput {...defaultProps} onAddTask={onAddTask} isLoading />)

      const input = screen.getByPlaceholderText('Add a new adventure...')
      fireEvent.change(input, { target: { value: 'New task' } })
      fireEvent.submit(input.closest('form')!)

      expect(onAddTask).not.toHaveBeenCalled()
    })
  })

  describe('button state', () => {
    it('should disable button when input is empty', () => {
      render(<KidsAddTaskInput {...defaultProps} />)
      expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
    })

    it('should enable button when input has text', () => {
      render(<KidsAddTaskInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Add a new adventure...')
      fireEvent.change(input, { target: { value: 'Task' } })

      expect(screen.getByRole('button', { name: /add/i })).not.toBeDisabled()
    })
  })
})
