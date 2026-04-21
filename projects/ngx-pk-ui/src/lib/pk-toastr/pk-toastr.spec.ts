import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PkToastr } from './pk-toastr';
import { PkToastrService } from './pk-toastr.service';

describe('PkToastrService', () => {
  let service: PkToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PkToastrService);
  });

  afterEach(() => service.clear());

  it('should add a success toast', () => {
    service.success('Saved!');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should dismiss a toast by id', () => {
    service.info('Hello', undefined, 0);
    const id = service.toasts()[0].id;
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });

  it('should auto-dismiss after duration', () => {
    vi.useFakeTimers();
    service.success('Auto', undefined, 500);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(500);
    expect(service.toasts().length).toBe(0);
    vi.useRealTimers();
  });
});

describe('PkToastr', () => {
  let fixture: ComponentFixture<PkToastr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PkToastr],
    }).compileComponents();
    fixture = TestBed.createComponent(PkToastr);
    fixture.detectChanges();
  });

  it('should render toasts', () => {
    const service = TestBed.inject(PkToastrService);
    service.error('Something went wrong', undefined, 0);
    fixture.detectChanges();
    const toast = fixture.nativeElement.querySelector('.pk-toast--error');
    expect(toast).toBeTruthy();
    service.clear();
  });
});
