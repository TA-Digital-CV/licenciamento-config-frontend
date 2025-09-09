// Types for License Parameters API

export interface LicenseParameterResponseDTO {
  id: string;
  licenseTypeId: string;
  validityUnit: string;
  validityPeriod: number;
  model: string;
  provisionalValidity: number;
  definitiveLicenseValidity: number;
  provisionalDefaultPeriod: number;
  definitiveDefaultPeriod: number;
  provisionalRenewalPeriod: number;
  maxProvisonalRenewal: number;
  definitiveRenewalPeriod: number;
  definitiveRenewalDefaultPeriod: number;
  renewalDefaultPeriod: number;
  maxRenewalPeriod: number;
  vitalityFlag: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseParameterRequestDTO {
  licenseTypeId: string;
  validityUnit: string;
  validityPeriod: number;
  model: string;
  provisionalValidity: number;
  definitiveLicenseValidity: number;
  provisionalDefaultPeriod: number;
  definitiveDefaultPeriod: number;
  provisionalRenewalPeriod: number;
  maxProvisonalRenewal: number;
  definitiveRenewalPeriod: number;
  definitiveRenewalDefaultPeriod: number;
  renewalDefaultPeriod: number;
  maxRenewalPeriod: number;
  vitalityFlag: boolean;
}

export interface WrapperListLicenseParameterDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: LicenseParameterResponseDTO[];
}