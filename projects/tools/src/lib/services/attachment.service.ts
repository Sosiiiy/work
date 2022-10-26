import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private url;
  constructor(private http: HttpClient, @Inject('env') private env: any) {
    this.url = env.api;
  }

  uploadFile(name: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.url + `api/Attachment/uploadFormFile`, formData);
  }

  getQRCode() {
    return this.http.get(this.url + `api/qrCode`, { responseType: 'text' });
  }
}
