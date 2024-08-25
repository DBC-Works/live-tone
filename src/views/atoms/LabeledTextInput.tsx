type Props = React.ComponentProps<'input'>

/**
 * Labeled input text
 * @param props Props
 * @returns Rendering result
 */
export const LabeledTextInput: React.FC<Props> = ({
  id,
  type,
  children,
  value,
  readOnly,
  onChange,
}): JSX.Element => (
  <div>
    <div className="flex justify-end">
      <label className="label label-text" htmlFor={id}>
        {children}
      </label>
    </div>
    <div className="w-full">
      <input
        type={type}
        id={id}
        className="input input-bordered input-sm w-full"
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  </div>
)
