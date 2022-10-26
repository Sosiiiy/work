import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotActiveComponent } from './not-active.component';

describe('NotActiveComponent', () => {
  let component: NotActiveComponent;
  let fixture: ComponentFixture<NotActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotActiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
