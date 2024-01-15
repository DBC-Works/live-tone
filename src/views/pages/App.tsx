import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { evalErrorAtom, playingAtom, resetPlayingAtom } from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
import { LiveCodeTextArea } from '@/views/organisms/LiveCodeTextArea'
import { EvalError } from '@/views/atoms/EvalError'
import { AppHeader } from '@/views/organisms/AppHeader'
import { ToolBar } from '@/views/organisms/ToolBar'

/**
 * App component
 * @returns rendering result
 */
export const App: React.FC = (): JSX.Element => {
  const playingSet = useAtomValue(playingAtom)
  const resetPlaying = useSetAtom(resetPlayingAtom)
  const evalError = useAtomValue(evalErrorAtom)

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPlaying(playingSet)
      resetPlaying()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [playingSet, resetPlaying])

  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <main className="grow">
        <div className="flex flex-col h-full">
          <ToolBar />
          <div className="grow">
            <div className="flex flex-col h-full">
              <div className="grow mb-4">
                <LiveCodeTextArea />
              </div>
              {evalError !== null && (
                <div className="basis-1 mb-4">
                  <EvalError />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
