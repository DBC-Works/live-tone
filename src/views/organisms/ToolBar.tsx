import { RunButton } from '@/views/atoms/RunButton'
import { StopButton } from '@/views/atoms/StopButton'

/**
 * ToolBar component
 * @returns rendering result
 */
export const ToolBar: React.FC = (): JSX.Element => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <RunButton />
    </div>
    <div>
      <StopButton />
    </div>
  </div>
)
