import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RemotesComponent } from './remotes.component';

describe('RemotesComponent', () => {
  let component: RemotesComponent;
  let fixture: ComponentFixture<RemotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemotesComponent],
      providers: [provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
