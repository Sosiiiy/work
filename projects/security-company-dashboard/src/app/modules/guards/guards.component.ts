import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, UntypedFormControl, Validators } from '@angular/forms';
import { AcceptedFile, AttachmentService, CanvasService, ModalService, Regex,language } from 'projects/tools/src/public-api';
import { AccountService } from '../account-management/services/account.service';
import { GuardsRoutesList } from './routes/guards-routes.enum';
import { combineLatest, elementAt, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'projects/tools/src/lib/validators/custom-validators.class';
import { Lookup } from 'projects/tools/src/lib/models/lookup';
import { LangService } from 'projects/tools/src/lib/services/lang.service';
import { LookupService } from 'projects/tools/src/lib/services/lookups.service';
import { AuthService } from '../auth/services/auth.service';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateType } from 'ngx-hijri-gregorian-datepicker'; 

@Component({
  selector: 'app-guards',
  templateUrl: './guards.component.html',
  styleUrls: ['./guards.component.scss'],
})
export class GuardsComponent implements OnInit {
  @ViewChild('form') form!: FormGroupDirective;
  list = [...GuardsRoutesList];
  canvasId = 'add-user';
  date!: NgbDate;
selectedDateType  =  DateType.Hijri; 
  selectedDate! :NgbDateStruct
  guardForm!: FormGroup;
  bloodTypes:any[] = [];
  genders:any [] = [];
  cities: any[]=[];
  nationalities:any[]=[];
  jobTypes:any [] = [];
  isAr!: boolean;
  //date!: boolean;
  profileImage!: string | null;
  
  
  constructor(
    public canvas: CanvasService,
    private fb: FormBuilder,
    private attachment: AttachmentService,
    private modal: ModalService,
    private lookup: LookupService,
    private accountServices: AccountService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private lang: LangService,
    //private islam:IslamicDateComponent
  ) {
    this.generateguardForm();
    this.checkLang();
  }
  

  get controls(): any {
    return this.guardForm.controls;
  }

  
 
  ngOnInit(): void {
    this.getInitData();
  }

  onAdd() {
    this.canvas.open(this.canvasId);
  }
  generateguardForm() {
    this.guardForm = this.fb.group({
      firstName: [null,[
        Validators.required,
        Validators.pattern(`^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+(?:\s[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+)?$`),
      ]],
      middleName: ['', [
        Validators.required,
        Validators.pattern(`^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+(?:\s[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+)?$`),
      ],],
      lastName: ['', [
        Validators.required,
        Validators.pattern(`^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+(?:\s[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+)?$`),
      ],],
      nationalID: [null, [Validators.required]],
      // BirthDate: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      genderId: ['', [Validators.required]],
      bloodTypeId: ['', [Validators.required]],
       nationalityId: ['', [Validators.required]],
       cityId: ['', [Validators.required]],
      jobTypeId:['', [Validators.required]],
      profileImageId:[null]
    });
  }


  loadCities(id: any) {
    this.lookup.getCity(id).subscribe((res) => {
      this.cities = res;
    });
  }

  checkLang() {
    this.lang.language.subscribe((res) => {
      this.isAr = res === language.ar;
    });
  }

  public get BirthDate(): FormControl {
    return this.guardForm.get('birthDate') as FormControl;
  }

  getInitData() {
      this.lookup.getGender().subscribe((x)=>
    {x.forEach(element => {this.genders.push(element)
      console.log("gggggg"+element);
    })
    console.log("gender"+this.genders)
    });

   
    this.lookup.getBloodType().subscribe((x)=>
    {x.forEach(element => {this.bloodTypes.push(element)
      console.log("gggggg"+element);
    })
    console.log("blood"+this.bloodTypes)
    });

    this.lookup.getCity().subscribe((x)=>
    {x.forEach(element => {this.cities.push(element)
      console.log("gggggg"+element);
    })
    console.log("blood"+this.cities)
    });

    this.lookup.getNationality().subscribe((x)=>
    {x.forEach(element => {this.nationalities.push(element)
      console.log("gggggg"+element);
    })
    console.log("blood"+this.nationalities)
    });

    this.lookup.getJobType().subscribe((x)=>
    {x.forEach(element => {this.jobTypes.push(element)
      console.log("gggggg"+element);
    })
    console.log("blood"+this.nationalities)
    });
      
  }

  onImageUpload(event: any) {
    let arr = event?.target?.files[0]?.name.split('.');
    const extension = arr[arr.length - 1].toLowerCase();

    if (!AcceptedFile.includes(extension)) {
      (this.controls['profileImageId'] as FormControl).setErrors({
        notValid: true,
      });
      this.profileImage = null;
      return;
    } else {
      let url = URL.createObjectURL(event.target.files[0]);
      (this.controls['profileImageId'] as FormControl).setErrors({
        notValid: null,
      });
      this.profileImage = url;
      this.attachment
        .uploadFile(event.target.files[0].name, event.target.files[0])
        .subscribe((res) => {
          
            this.controls['profileImageId'].setValue(res);
          
        });
    }
  }


  onSubmit(guardForm:FormGroup){
  
   console.log("hello")
    console.log(guardForm);
    if(guardForm.invalid){return}
    else{
      console.log("value"+guardForm.value)
    this.lookup.postGuradForm(guardForm.value);
    }
     

    
  }



}
