import { FileObject } from 'projects/tools/src/public-api';

export interface ClientCompany {
  id: number;
  name: string;
  companyTypeId: number;
  commercialRegistrationNo: number;
  commercialRegistrationNumber: number;
  activityType: string;
  email: string;
  nationalAddress: string;
  chargePerson: string;
  chargePersonPhoneNumber: string;
  cityId: number;
  appUserId: string;
  photoId: number;
  photo: FileObject;
}
