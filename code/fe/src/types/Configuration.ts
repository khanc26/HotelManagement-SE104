export interface ConfigurationParam {
  paramName: string;
  paramValue: number;
  description?: string;
}

export interface UpdateParamDto {
  paramValue: number;
}