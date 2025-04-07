import { APIErrorResponse } from "@/types/api-response.type";
import { AxiosError } from "axios";

export function GetAPIErrorResponseData(error: Error) {
  const axiosError = error as AxiosError;
  return axiosError.response?.data as APIErrorResponse;
}
