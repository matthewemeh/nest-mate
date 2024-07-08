import { useRef } from 'react';

interface Props {
  cols?: number;
  rows?: number;
  label: string;
  value?: string;
  hidden?: boolean;
  textareaID?: string;
  tabIndex?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  textareaName?: string;
  defaultValue?: string;
  autoComplete?: string;
  spellCheck?: Booleanish;
  extraLabelClassNames?: string;
  extraTextareaClassNames?: string;
  extraLabelStyles?: React.CSSProperties;
  extraTextareaStyles?: React.CSSProperties;
  textAreaRef?: React.RefObject<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}

const TextArea: React.FC<Props> = ({
  cols,
  rows,
  label,
  value,
  hidden,
  tabIndex,
  required,
  readOnly,
  disabled,
  onChange,
  inputMode,
  autoFocus,
  textareaID,
  spellCheck,
  textAreaRef,
  placeholder,
  textareaName,
  autoComplete,
  defaultValue,
  extraLabelStyles,
  extraTextareaStyles,
  extraLabelClassNames,
  extraTextareaClassNames
}) => {
  const selfRef = useRef<HTMLTextAreaElement>(null);
  const ref: React.RefObject<HTMLTextAreaElement> = textAreaRef ?? selfRef;

  return (
    <div
      hidden={hidden}
      style={extraLabelStyles}
      className={`flex flex-col items-start gap-y-1.5 self-stretch text-topaz ${extraLabelClassNames}`}>
      <label
        htmlFor={textareaID}
        className={`cursor-pointer text-[14px] leading-[21px] font-medium after:text-coral-red after:pl-1 ${
          required && "after:content-['*']"
        }`}>
        {label}
      </label>

      <div className='relative w-full'>
        <textarea
          ref={ref}
          cols={cols}
          rows={rows}
          value={value}
          id={textareaID}
          name={textareaName}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
          tabIndex={tabIndex}
          required={required}
          autoFocus={autoFocus}
          inputMode={inputMode}
          spellCheck={spellCheck}
          placeholder={placeholder}
          style={extraTextareaStyles}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          className={`p-4 font-normal leading-[normal] flex gap-2 items-center self-stretch border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] w-full rounded-lg py-2.5 phones:tracking-[0.9px] bg-transp focus:border-nile-blue-900 disabled:opacity-50 ${extraTextareaClassNames}`}
        />
      </div>
    </div>
  );
};

export default TextArea;
