export interface ConfigurationParam {
  paramName: string;
  paramValue: number;
  description?: string;
  createAt?:  string;
  deleteAt?: string;
}

export interface UpdateParamDto {
  paramValue: number;
}