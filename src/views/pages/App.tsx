import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { runSettingsAtom, playingAtom, resetPlayingAtom } from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
import { AppHeader } from '@/views/organisms/AppHeader'
import { CodeEditorSection } from '@/views/organisms/CodeEditorSection'
import { ToolSection } from '@/views/organisms/ToolSection'
import { SettingsSection } from '@/views/organisms/SettingsSection'

/**
 * App component
 * @returns rendering result
 */
export const App: React.FC = (): JSX.Element => {
  const runSettings = useAtomValue(runSettingsAtom)
  const playingSet = useAtomValue(playingAtom)
  const resetPlaying = useSetAtom(resetPlayingAtom)

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPlaying(runSettings, playingSet)
      resetPlaying()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [runSettings, playingSet, resetPlaying])

  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <div className="grow md:flex md:flex-row">
        <main className="grow h-full flex flex-col md:flex-row">
          <div className="grow flex flex-col">
            <CodeEditorSection className="grow mb-4" />
            <ToolSection />
          </div>
        </main>
        <aside className="md:ml-4">
          <SettingsSection />
        </aside>
      </div>
    </div>
  )
}
