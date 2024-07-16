interface PaginationContext {
  page: number;
  limit: number;
  MIN_PAGE_INDEX: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

interface AuthContext {
  mailSubject: string;
  onOtpValidated: () => void;
}
