interface PaginationContext {
  page: number;
  limit: number;
  MIN_PAGE_INDEX: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

interface AuthContext {
  mailSubject: string;
  mailPretext: string;
  OTP_DETAILS_KEY: string;
  onOtpValidated: () => void;
}
