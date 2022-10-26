import { FileObject } from './file-object';

export interface ClientCompany {
  id: number;
  name: string;
  companyTypeId: number;
  commercialRegistrationNumber: number;
  activityType: string;
  email: string;
  nationalAddress: string;
  chargePerson: string;
  chargePersonPhoneNumber: string;
  cityId: number;
  appUserId: string;
  photoId: null;
  photo: FileObject;
}
