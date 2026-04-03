import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TelevisionsComponent } from './televisions.component';

describe('TelevisionsComponent', () => {
  let component: TelevisionsComponent;
  let fixture: ComponentFixture<TelevisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelevisionsComponent],
      providers: [provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
