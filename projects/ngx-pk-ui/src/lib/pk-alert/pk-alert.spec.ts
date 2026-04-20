import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PkAlertService } from './pk-alert.service';

describe('PkAlertService', () => {
  let svc: PkAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(PkAlertService);
  });

  afterEach(() => svc._resolve(undefined));

  it('should start with no slot', () => {
    expect(svc.slot()).toBeNull();
  });

  it('success() opens a slot of type success', () => {
    svc.success('All good');
    expect(svc.slot()?.config.type).toBe('success');
    expect(svc.slot()?.config.message).toBe('All good');
  });

  it('success() resolves to undefined when _resolve called', async () => {
    const p = svc.success('Done');
    svc._resolve(undefined);
    await expect(p).resolves.toBeUndefined();
  });

  it('warn() opens a slot of type warn', () => {
    svc.warn('Careful');
    expect(svc.slot()?.config.type).toBe('warn');
    svc._resolve(undefined);
  });

  it('error() opens a slot of type error', () => {
    svc.error('Bad thing');
    expect(svc.slot()?.config.type).toBe('error');
    svc._resolve(undefined);
  });

  it('confirm() resolves true on confirm', async () => {
    const p = svc.confirm('Are you sure?');
    svc._resolve(true);
    await expect(p).resolves.toBe(true);
  });

  it('confirm() resolves false on cancel', async () => {
    const p = svc.confirm('Are you sure?');
    svc._resolve(false);
    await expect(p).resolves.toBe(false);
  });

  it('input(string) resolves entered text', async () => {
    const p = svc.input('Enter name', 'string');
    expect(svc.slot()?.config.inputType).toBe('string');
    svc._resolve('Alice');
    await expect(p).resolves.toBe('Alice');
  });

  it('input(number) resolves entered number', async () => {
    const p = svc.input('Enter age', 'number');
    svc._resolve(30);
    await expect(p).resolves.toBe(30);
  });

  it('input(boolean) resolves boolean', async () => {
    const p = svc.input('Agree?', 'boolean');
    svc._resolve(true);
    await expect(p).resolves.toBe(true);
  });

  it('input(date) resolves date string', async () => {
    const p = svc.input('Pick date', 'date');
    svc._resolve('2026-04-20');
    await expect(p).resolves.toBe('2026-04-20');
  });

  it('input() resolves null on cancel', async () => {
    const p = svc.input('Enter something', 'string');
    svc._resolve(null);
    await expect(p).resolves.toBeNull();
  });

  it('slot is cleared after _resolve', () => {
    svc.success('Hi');
    svc._resolve(undefined);
    expect(svc.slot()).toBeNull();
  });
});
