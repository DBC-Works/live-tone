import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  runSettingsAtom,
  runningStateAtom,
  resetRunningStateAtom,
} from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
import { AppHeader } from '@/views/organisms/AppHeader'
import { CodeEditorSection } from '@/views/organisms/CodeEditorSection'
import { PlaySection } from '@/views/organisms/PlaySection'
import { SettingsSection } from '@/views/organisms/SettingsSection'

/**
 * App component
 * @returns rendering result
 */
export const App: React.FC = (): JSX.Element => {
  const runSettings = useAtomValue(runSettingsAtom)
  const runningState = useAtomValue(runningStateAtom)
  const resetRunningState = useSetAtom(resetRunningStateAtom)

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPlaying(runSettings, runningState)
      resetRunningState()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [runSettings, runningState, resetRunningState])

  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <div className="grow md:flex md:flex-row">
        <main className="grow h-full flex flex-col md:flex-row">
          <div className="grow flex flex-col">
            <CodeEditorSection className="grow mb-4" />
            <PlaySection />
          </div>
        </main>
        <aside className="md:ml-4">
          <SettingsSection />
        </aside>
      </div>
    </div>
  )
}
