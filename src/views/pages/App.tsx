import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { ConnectionStates } from '@/states/types'
import {
  connectionStateAtom,
  disconnectAtom,
  resetRunningStateAtom,
  runSettingsAtom,
  runningStateAtom,
} from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
import { AppHeader } from '@/views/organisms/AppHeader'
import { CodeEditorSection } from '@/views/organisms/CodeEditorSection'
import { PlaySection } from '@/views/organisms/PlaySection'
import { SharingSection } from '@/views/organisms/SharingSection'
import { SettingsSection } from '@/views/organisms/SettingsSection'

/**
 * App component
 * @returns rendering result
 */
export const App: React.FC = (): JSX.Element => {
  const connectionState = useAtomValue(connectionStateAtom)
  const disconnect = useSetAtom(disconnectAtom)
  const runSettings = useAtomValue(runSettingsAtom)
  const runningState = useAtomValue(runningStateAtom)
  const resetRunningState = useSetAtom(resetRunningStateAtom)

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPlaying(runSettings, runningState)
      resetRunningState()
      if (connectionState === ConnectionStates.Connected) {
        disconnect()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [
    connectionState,
    disconnect,
    runSettings,
    runningState,
    resetRunningState,
  ])

  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <div className="grow md:flex md:flex-row">
        <main className="grow h-full flex flex-col md:flex-row">
          <div className="grow flex flex-col">
            <CodeEditorSection className="grow mb-2" />
            <PlaySection className="mb-4" />
            <SharingSection className="mb-4" />
          </div>
        </main>
        <aside className="md:ml-4">
          <SettingsSection />
        </aside>
      </div>
    </div>
  )
}
