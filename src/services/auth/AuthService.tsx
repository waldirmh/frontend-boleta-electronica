import apiClient from "@/api/axios";
import { UserLoginDTO, UserRegisterDTO } from "./types";

export class AuthService {

  /**
   * 
   * @param user 
   * @returns 
   */
  static async loginRequest(user: UserLoginDTO) {
    return await apiClient.post(`auth/signin`, user);
  };

  /**
   * 
   * @param user 
   * @returns 
   */
  static async registerRequest(user: UserRegisterDTO) {
    return await apiClient.post(`/auth/signup`, user);
  };

  /**
   * 
   * @param token 
   * @returns 
   */
  static async refreshTokenRequest(token: any) {
    return await apiClient.post(`/auth/refresh-token`, token);
  };

}