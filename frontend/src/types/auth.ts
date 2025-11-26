import { User } from "./user";

export interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  userType?: 'student' | 'instructor';
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
}

export interface SocialAuthProvider {
  name: string;
  icon: string;
  color: string;
  href: string;
}

// Props for components
export interface LoginFormProps {
  onSubmit: (data: AuthFormData) => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
}

export interface RegisterFormProps {
  onSubmit: (data: AuthFormData) => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
}
