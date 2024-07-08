interface AlertProps {
  msg: string;
  zIndex?: string;
  bgColor?: string;
  duration?: number;
  textColor?: string;
}

interface FormatInputTextProps {
  text: string;
  regex?: RegExp;
  allowedChars?: string;
  disallowedChars?: string;
}
