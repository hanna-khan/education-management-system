export type BookStatus = "available" | "issued" | "reserved" | "lost" | "damaged" | "maintenance";
export type IssueStatus = "issued" | "returned" | "overdue" | "lost" | "renewed";
export type ReservationStatus = "pending" | "ready" | "fulfilled" | "cancelled" | "expired";
export type FineStatus = "unpaid" | "paid" | "waived" | "partial";
export type MemberType = "student" | "faculty" | "staff" | "alumni";
export type DigitalResourceType = "ebook" | "journal" | "database" | "video" | "thesis";

export interface LibraryAuthor {
  id: string;
  name: string;
  nationality: string;
  booksCount: number;
}

export interface LibraryPublisher {
  id: string;
  name: string;
  city: string;
  country: string;
  booksCount: number;
}

export interface LibraryCategory {
  id: string;
  name: string;
  code: string;
  booksCount: number;
  parentId?: string;
}

export interface LibraryShelf {
  id: string;
  code: string;
  floor: string;
  section: string;
  capacity: number;
  occupied: number;
}

export interface LibraryRack {
  id: string;
  code: string;
  shelfId: string;
  shelfCode: string;
  rows: number;
  booksCount: number;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher: string;
  category: string;
  categoryId: string;
  year: number;
  edition: string;
  language: string;
  pages: number;
  copiesTotal: number;
  copiesAvailable: number;
  shelf: string;
  rack: string;
  status: BookStatus;
  dewey: string;
  description: string;
  tags: string[];
}

export interface LibraryCopy {
  id: string;
  barcode: string;
  bookId: string;
  bookTitle: string;
  shelf: string;
  rack: string;
  condition: "good" | "fair" | "damaged" | "lost";
  status: BookStatus;
  acquired: string;
}

export interface LibraryMember {
  id: string;
  memberId: string;
  name: string;
  type: MemberType;
  department: string;
  email: string;
  phone: string;
  maxBooks: number;
  issuedCount: number;
  overdueCount: number;
  fineBalance: number;
  status: "active" | "blocked" | "expired";
  joined: string;
}

export interface LibraryIssue {
  id: string;
  copyBarcode: string;
  bookTitle: string;
  bookId: string;
  memberId: string;
  memberName: string;
  issuedAt: string;
  dueAt: string;
  returnedAt?: string;
  renewals: number;
  status: IssueStatus;
  fine: number;
}

export interface LibraryReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  reservedAt: string;
  expiresAt: string;
  status: ReservationStatus;
  queuePosition: number;
}

export interface LibraryFine {
  id: string;
  memberId: string;
  memberName: string;
  bookTitle: string;
  reason: "overdue" | "lost" | "damaged" | "other";
  amount: number;
  paid: number;
  status: FineStatus;
  createdAt: string;
}

export interface DigitalResource {
  id: string;
  title: string;
  type: DigitalResourceType;
  provider: string;
  accessUrl: string;
  subjects: string[];
  subscribers: number;
  status: "active" | "expired" | "trial";
}

export interface LibraryStats {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  issuedToday: number;
  overdue: number;
  reservations: number;
  unpaidFines: number;
  members: number;
  digitalResources: number;
}
