import { useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'

import { CodeState } from '@/states/types'
import { evalErrorAtom, runningStateAtom } from '@/states/atoms'
import { CodeEditor } from '@/views/atoms/CodeEditor'
import { EvalError } from '@/views/atoms/EvalError'

type Props = React.ComponentProps<'section'>

/**
 * Use code sate hook
 * @returns Code state
 */
const useCodeState = (): CodeState => {
  const { nowPlaying, updated } = useAtomValue(runningStateAtom)
  const evalError = useAtomValue(evalErrorAtom)

  if (evalError !== null) {
    return CodeState.Error
  }
  if (nowPlaying === false) {
    return CodeState.Ready
  }

  return updated !== false ? CodeState.Updated : CodeState.Playing
}

/**
 * Code editor section
 * @param props props
 * @returns Rendering result
 */
export const CodeEditorSection: React.FC<Props> = ({
  className,
}): JSX.Element => {
  const [evalError, setEvalError] = useAtom(evalErrorAtom)

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (evalError !== null) {
        setEvalError(e.error)
      }
    }
    window.addEventListener('error', handleError)
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [evalError, setEvalError])

  const classNames = [
    'textarea',
    'textarea-bordered',
    'resize-none',
    'w-full',
    'h-full',
    'grow',
    'mt-1',
  ]
  let stateText = 'Ready'
  let stateTextClass = ''
  switch (useCodeState()) {
    case CodeState.Playing:
      stateText = 'Playing'
      stateTextClass = 'font-bold text-success'
      classNames.push('textarea-success')
      break
    case CodeState.Updated:
      stateText = 'Updated'
      stateTextClass = 'font-bold text-info'
      classNames.push('textarea-info')
      break
    case CodeState.Error:
      stateText = 'Error'
      stateTextClass = 'font-bold text-error'
      classNames.push('textarea-error')
      break
  }

  return (
    <section className={`${className} flex flex-col`}>
      <div className="hidden md:flex md:flex-row">
        <h2 className="flex-auto text-base font-bold">
          <label htmlFor="code">Code to run</label>
        </h2>
        <div
          role="status"
          aria-live="polite"
          className={`px-1 ${stateTextClass}`}
        >
          {stateText}
        </div>
      </div>
      <div className={classNames.join(' ')}>
        <CodeEditor id="code" />
      </div>
      {evalError !== null && (
        <div className="basis-1 mt-2">
          <EvalError />
        </div>
      )}
    </section>
  )
}
