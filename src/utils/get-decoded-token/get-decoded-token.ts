import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
}

export const getDecodedToken = (token: string): CustomJwtPayload | null => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
