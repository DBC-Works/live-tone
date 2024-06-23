import { useEffect } from 'react'
import { useAtom } from 'jotai'

import { evalErrorAtom } from '@/states/atoms'
import { EvalError } from '@/views/atoms/EvalError'

import { CodeEditor } from '@/views/atoms/CodeEditor'

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
  if (evalError !== null) {
    classNames.push('textarea-error')
  }

  return (
    <section className={`${className} flex flex-col`}>
      <h2 className="text-base hidden md:block">
        <label htmlFor="code">Code to run</label>
      </h2>
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
