import { useRef, useState } from 'react';
import { HiLockClosed } from 'react-icons/hi';
import { AiOutlineMail } from 'react-icons/ai';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

import { formatInputText } from 'utils';

interface Props {
  label: string;
  value?: string;
  accept?: string;
  hidden?: boolean;
  inputID?: string;
  tabIndex?: number;
  multiple?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  inputName?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  spellCheck?: Booleanish;
  extraLabelClassNames?: string;
  extraInputClassNames?: string;
  type?: React.HTMLInputTypeAttribute;
  extraLabelStyles?: React.CSSProperties;
  extraInputStyles?: React.CSSProperties;
  inputRef?: React.RefObject<HTMLInputElement>;
  formatRule?: Omit<FormatInputTextProps, 'text'>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}

const FormInput: React.FC<Props> = ({
  type,
  label,
  value,
  accept,
  hidden,
  inputID,
  tabIndex,
  required,
  readOnly,
  disabled,
  inputRef,
  multiple,
  onChange,
  inputMode,
  autoFocus,
  inputName,
  formatRule,
  spellCheck,
  placeholder,
  autoComplete,
  defaultValue,
  extraInputStyles,
  extraLabelStyles,
  extraInputClassNames,
  extraLabelClassNames
}) => {
  const selfRef = useRef<HTMLInputElement>(null);
  const isEmailField: boolean = inputName === 'email';
  const isPasswordField: boolean = type === 'password';
  const ref: React.RefObject<HTMLInputElement> = inputRef ?? selfRef;
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  return (
    <div
      hidden={hidden}
      style={extraLabelStyles}
      className={`flex flex-col items-start gap-y-1.5 self-stretch text-topaz ${extraLabelClassNames}`}>
      <label
        htmlFor={inputID}
        className={`cursor-pointer text-[14px] leading-[21px] font-medium after:text-coral-red after:pl-1 ${
          required && "after:content-['*']"
        }`}>
        {label}
      </label>

      <div className='relative w-full'>
        {isPasswordField && (
          <HiLockClosed className='absolute top-1/2 -translate-y-1/2 left-3.5 bg-[url(./assets/lock.svg)] bg-no-repeat bg-contain w-5 h-5 outline-none' />
        )}
        {isEmailField && (
          <AiOutlineMail className='absolute top-1/2 -translate-y-1/2 left-3.5 bg-[url(./assets/email.svg)] bg-no-repeat bg-contain w-5 h-5 outline-none' />
        )}
        <input
          ref={ref}
          id={inputID}
          value={value}
          accept={accept}
          name={inputName}
          multiple={multiple}
          disabled={disabled}
          readOnly={readOnly}
          onChange={e => {
            let oldText: string = e.target.value;
            if (formatRule) {
              e.target.value = formatInputText({ text: oldText, ...formatRule });
            }
            onChange?.(e);
          }}
          tabIndex={tabIndex}
          required={required}
          autoFocus={autoFocus}
          inputMode={inputMode}
          spellCheck={spellCheck}
          style={extraInputStyles}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          type={isPasswordField ? (passwordVisible ? 'text' : 'password') : type}
          className={`form-input font-normal flex gap-2 items-center self-stretch border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] w-full rounded-lg py-2.5 phones:tracking-[0.9px] focus:border-lightning-yellow-900 disabled:opacity-50 ${
            isPasswordField || isEmailField ? 'px-10' : 'px-3'
          } ${extraInputClassNames}`}
        />
        {isPasswordField && (
          <button
            type='button'
            aria-label='show password'
            onClick={e => {
              setPasswordVisible(prev => !prev);

              const oldAriaLabel: string = e.currentTarget.ariaLabel!;
              if (oldAriaLabel.includes('show')) {
                e.currentTarget.ariaLabel = oldAriaLabel.replace('show', 'hide');
              } else if (oldAriaLabel.includes('hide')) {
                e.currentTarget.ariaLabel = oldAriaLabel.replace('hide', 'show');
              }
            }}
            className='absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 outline-1 outline-transparent focus-visible:outline-lightning-yellow-900'>
            {passwordVisible ? (
              <FaRegEye className='w-full h-full' />
            ) : (
              <FaRegEyeSlash className='w-full h-full' />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
