import { useEffect } from 'react'
import { useAtom } from 'jotai'

import { CodeState } from '@/states/types'
import { evalErrorAtom } from '@/states/atoms'
import { useCodeState } from '@/views/hooks/hooks'
import { CodeEditor } from '@/views/atoms/CodeEditor'
import { EvalError } from '@/views/atoms/EvalError'
import { CodeEditorSectionHeader } from './CodeEditorSectionHeader'

type Props = React.ComponentProps<'section'>

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
  switch (useCodeState()) {
    case CodeState.Playing:
      classNames.push('textarea-success')
      break
    case CodeState.Updated:
      classNames.push('textarea-info')
      break
    case CodeState.Error:
      classNames.push('textarea-error')
      break
  }

  return (
    <section className={`${className} flex flex-col`}>
      <CodeEditorSectionHeader controls="id" />
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
