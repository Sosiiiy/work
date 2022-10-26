import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { language } from '../enums/language.enum';
import { StorageKeys } from '../keys/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  language;
  snapshot!: { lang: string };
  isAr!: BehaviorSubject<boolean>;

  constructor(private translate: TranslateService) {
    this.snapshot = { lang: language.default };
    this.language = new BehaviorSubject<string>(language.default);
    this.isAr = new BehaviorSubject(true);
  }

  initLanguage() {
    let lang: any = localStorage.getItem(StorageKeys.lang)!;
    if (lang) {
      this.setCurrentLanguage(lang);
    } else {
      this.setCurrentLanguage(language.default);
    }
  }

  getCurrentLanguage() {
    let lang = localStorage.getItem(StorageKeys.lang)!;

    this.language.next(lang);
    this.snapshot.lang = lang;
    return this.language.asObservable();
  }

  setCurrentLanguage(_language: string) {
    _language == language.ar ? this.isAr.next(true) : this.isAr.next(false);
    this.translate.use(_language);
    localStorage.setItem(StorageKeys.lang, _language);
    this.changeDocumentAttr(_language);
    this.language.next(_language);
    this.snapshot.lang = _language;
  }

  toggleLanguage() {
    if (this.snapshot.lang == language.ar) {
      this.setCurrentLanguage(language.en);
    } else {
      this.setCurrentLanguage(language.ar);
    }
  }

  changeDocumentAttr(lang: string) {
    document.documentElement.setAttribute('lang', lang);
    let dir = lang === language.ar ? 'rtl' : 'ltr';

    document.documentElement.setAttribute('dir', dir);
    document.body.setAttribute('class', lang);
  }
}
