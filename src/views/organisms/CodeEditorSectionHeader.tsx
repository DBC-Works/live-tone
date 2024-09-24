import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { CodeState } from '@/states/types'
import { receivedCodesAtom, selectedTabIndexAtom } from '@/states/atoms'
import { useCodeState } from '@/views/hooks/hooks'

/**
 * Tab props
 */
type TabProps = React.ComponentProps<'a'> & {
  index: number
  controls: string
  mark: boolean
  selected: boolean
}

/**
 * Tab in code editor
 * @param props Props
 * @returns Rendering result
 */
const Tab: React.FC<React.PropsWithChildren<TabProps>> = ({
  children,
  index,
  controls,
  mark,
  selected,
}): JSX.Element => {
  const setSelectedTabIndex = useSetAtom(selectedTabIndexAtom)
  const handleClick = useCallback(() => {
    setSelectedTabIndex(index)
  }, [index, setSelectedTabIndex])

  return (
    <a
      role="tab"
      aria-controls={controls}
      aria-selected={selected}
      className={`tab${selected !== false ? ' tab-active' : ''}`}
      onClick={handleClick}
    >
      <h2 className="inline text-base">
        <label htmlFor={controls}>{children}</label>
        {mark !== false && ' *'}
      </h2>
    </a>
  )
}

/**
 * Code editor section header props
 */
type Props = React.ComponentProps<'header'> & {
  controls: string
}

/**
 * Code editor section header
 * @param props Props
 * @returns Rendering result
 */
export const CodeEditorSectionHeader: React.FC<Props> = ({
  controls,
}): JSX.Element => {
  const selectedTabIndex = useAtomValue(selectedTabIndexAtom)
  const receivedCodes = useAtomValue(receivedCodesAtom)

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
      <div className="flex-auto">
        <div
          role="tablist"
          aria-label="code list"
          className="tabs tabs-bordered"
        >
          <Tab
            index={0}
            controls={controls}
            selected={selectedTabIndex === 0}
            mark={false}
          >
            Your code
          </Tab>
          {receivedCodes.map(({ id, tag, latest }, index) => (
            <Tab
              key={id}
              index={index + 1}
              controls={controls}
              selected={index === selectedTabIndex - 1}
              mark={latest !== false}
            >
              {tag}
            </Tab>
          ))}
        </div>
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
