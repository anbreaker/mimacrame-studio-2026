export interface AppUser {
  address?: {
    city: string;
    country: string;
    fullName: string;
    phone: string;
    postalCode: string;
    province: string;
    street: string;
  };
  createdAt?: string;
  displayName: string | null;
  email: string | null;
  isAdmin: boolean;
  photoURL: string | null;
  uid: string;
  updatedAt?: string;
}
