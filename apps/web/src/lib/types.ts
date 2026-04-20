export type Role = "CUSTOMER" | "RECEPTIONIST" | "HOUSEKEEPING" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type RoomStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "DIRTY"
  | "CLEANING"
  | "MAINTENANCE"
  | "RESERVED";

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "PAYING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "EXPIRED";

export interface RoomType {
  id: string;
  name: string;
  description?: string | null;
  maxGuests: number;
  areaSqm: number;
  bedType: string;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  notes?: string | null;
  roomType?: RoomType;
  roomTypeId: string;
}

export interface SearchResult {
  roomType: RoomType;
  rooms: Room[];
  pricePerNight: number;
  nights: number;
  totalPrice: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string | number;
  status: BookingStatus;
  paymentDeadline: string;
  guestNotes?: string | null;
  createdAt: string;
  room?: Room & { roomType?: RoomType };
  customer?: AuthUser;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
