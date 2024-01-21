import { RunButton } from '@/views/atoms/RunButton'
import { StopButton } from '@/views/atoms/StopButton'

type Props = React.ComponentProps<'section'>

/**
 * ToolSection component
 * @param props props
 * @returns rendering result
 */
export const ToolSection: React.FC<Props> = ({ className }): JSX.Element => (
  <section className={`grid grid-cols-2 gap-4 mb-4 ${className}`}>
    <RunButton />
    <StopButton />
  </section>
)
