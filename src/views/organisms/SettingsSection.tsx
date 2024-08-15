import { CancelTransportToggle } from '@/views/atoms/CancelTransportToggle'
import { EnableLiveAutoCompletionToggle } from '@/views/atoms/EnableLiveAutoCompletionToggle'
import { WebSocketServerUrlInput } from '@/views/atoms/WebSocketServerUrlInput'
import { TagTextInput } from '@/views/atoms/TagTextInput'

type Props = React.ComponentProps<'section'>

/**
 * Settings section
 * @param props props
 * @returns Rendering result
 */
export const SettingsSection: React.FC<Props> = ({
  className,
}): JSX.Element => (
  <section className={className}>
    <h2 className="text-base font-bold hidden md:block">Sharing settings</h2>
    <div className="w-full mb-2">
      <WebSocketServerUrlInput />
      <TagTextInput />
    </div>
    <h2 className="text-base font-bold hidden md:block">Run settings</h2>
    <div className="flex justify-end">
      <CancelTransportToggle />
    </div>
    <h2 className="text-base font-bold hidden md:block">Edit settings</h2>
    <div className="flex justify-end">
      <EnableLiveAutoCompletionToggle />
    </div>
  </section>
)
