import { CodeState } from '@/states/types'
import { useCodeState } from '@/views/hooks/hooks'

type Props = React.ComponentProps<'header'> & {
  controls: string
}

/**
 * Code editor section header
 * @returns Rendering result
 */
export const CodeEditorSectionHeader: React.FC<Props> = ({
  controls,
}): JSX.Element => {
  let stateText = 'Ready'
  let stateTextClass = ''
  switch (useCodeState()) {
    case CodeState.Playing:
      stateText = 'Playing'
      stateTextClass = 'font-bold text-success'
      break
    case CodeState.Updated:
      stateText = 'Updated'
      stateTextClass = 'font-bold text-info'
      break
    case CodeState.Error:
      stateText = 'Error'
      stateTextClass = 'font-bold text-error'
      break
  }

  return (
    <header className="flex flex-row">
      <div
        role="tablist"
        aria-label="code list"
        className="tabs tabs-bordered flex-auto"
      >
        <a
          role="tab"
          aria-controls={controls}
          aria-selected="true"
          className="tab tab-active"
        >
          <h2 className="text-base">Your code</h2>
        </a>
      </div>
      <div
        role="status"
        aria-live="polite"
        className={`px-1 min-w-16 text-right ${stateTextClass}`}
      >
        {stateText}
      </div>
    </header>
  )
}
