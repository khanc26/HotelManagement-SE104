export interface ConfigurationParam {
  paramName: string;
  paramValue: number;
  description?: string;
  createAt?: Date | string;
  deleteAt?: Date | string;
}

export interface UpdateParamDto {
  paramValue: number;
}