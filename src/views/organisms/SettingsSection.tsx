import { CancelTransportToggle } from '@/views/atoms/CancelTransportToggle'

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
    <h2 className="text-base">Run settings</h2>
    <div className="flex justify-end">
      <CancelTransportToggle />
    </div>
  </section>
)
