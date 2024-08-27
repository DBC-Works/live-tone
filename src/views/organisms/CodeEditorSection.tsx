import { useEffect } from 'react'
import { useAtom } from 'jotai'

import { CodeState, ErrorTypes } from '@/states/types'
import { errorAtom } from '@/states/atoms'
import { useCodeState } from '@/views/hooks/hooks'
import { CodeEditor } from '@/views/atoms/CodeEditor'
import { ErrorReporter } from '@/views/atoms/ErrorReporter'
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
  const [errorInfo, setErrorInfo] = useAtom(errorAtom)

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      setErrorInfo({ error: e.error, type: ErrorTypes.Eval })
    }
    window.addEventListener('error', handleError)
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [setErrorInfo])

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
      <CodeEditorSectionHeader controls="code" />
      <div className={classNames.join(' ')}>
        <CodeEditor id="code" />
      </div>
      {errorInfo.error !== null && (
        <div className="basis-1 mt-2">
          <ErrorReporter />
        </div>
      )}
    </section>
  )
}
