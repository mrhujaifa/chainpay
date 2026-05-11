export interface FirebaseUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthUserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
}
