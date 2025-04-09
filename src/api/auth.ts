import axios from "./axios";
import { userRegisterDTO, userLoginDTO } from '@/interface/auth-interface';

export const registerRequest = async (user: userRegisterDTO) => {
  return axios.post(`/auth/signup`, user);
};

export const loginRequest = async (user: userLoginDTO) => {
  return axios.post(`auth/signin`, user, {
    withCredentials: true,
  });
};
