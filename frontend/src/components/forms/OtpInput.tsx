import { formatInputText } from 'utils';

interface Props {
  otp: string;
  numberOfDigits?: number;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  onUpdateOtp?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateFocus?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OtpInput: React.FC<Props> = ({
  otp,
  setOtp,
  onUpdateOtp,
  onUpdateFocus,
  numberOfDigits = 6
}) => {
  const digitIndices: number[] = Array.from({ length: numberOfDigits }, (_, index) => index);

  const updateOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formatedOtp: string;
    const otpLength: number = otp.length;
    const typedCharacter: string = e.target.value;
    const pressedBackspace: boolean = e.target.value.length === 0;

    if (pressedBackspace) {
      // remove last typed character from otp
      formatedOtp = otp.slice(0, otpLength - 1);
    } else {
      // append typed character to otp
      formatedOtp = formatInputText({
        text: otp.concat(typedCharacter),
        allowedChars: '0123456789'
      });
    }

    setOtp(formatedOtp);
    onUpdateOtp?.(e);
  };

  const updateFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputTag = e.currentTarget;
    type InputElement = HTMLInputElement | null;

    if (inputTag.value.length === 1) {
      const nextSibling = inputTag.nextElementSibling as InputElement;

      nextSibling?.focus();
    } else if (e.key === 'Backspace') {
      const previousSibling = inputTag.previousElementSibling as InputElement;

      previousSibling?.focus();
    }
    onUpdateFocus?.(e);
  };

  return (
    <div className='flex items-start gap-x-6 phones:justify-center'>
      {digitIndices.map(digitIndex => {
        const isFirstInput: boolean = digitIndex === 0;

        return (
          <input
            type='text'
            maxLength={1}
            key={digitIndex}
            autoComplete='off'
            inputMode='numeric'
            onChange={updateOtp}
            onKeyUp={updateFocus}
            autoFocus={isFirstInput}
            value={otp!.charAt(digitIndex)}
            className='caret-transparent w-[47px] h-16 flex items-center self-stretch shrink-0 gap-2 p-2 rounded-lg text-[40px] leading-[60px] text-nile-blue-900 font-semibold border border-nile-blue-700 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] text-center outline-none focus:border-4 focus:border-nile-blue-500 400px:w-[14%]'
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
