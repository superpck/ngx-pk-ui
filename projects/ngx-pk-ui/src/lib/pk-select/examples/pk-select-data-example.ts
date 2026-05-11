import { Component, signal, effect } from '@angular/core';
import { PkSelectComponent, SelectOption } from '../index';

@Component({
  selector: 'pk-select-data-example',
  imports: [PkSelectComponent],
  template: `
    <div style="max-width: 600px;">
      <h4 style="margin-bottom: 12px;">Loading Data from Table/API</h4>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">
            Select province
          </label>
          <pk-select
            [options]="provinceOptions()"
            [searchable]="true"
            [placeholder]="isLoadingProvinces() ? 'Loading...' : 'Select province'"
            [disabled]="isLoadingProvinces()"
            (change)="onProvinceChange($event)" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">
            เลือกอำเภอ
          </label>
          <pk-select
            [options]="districtOptions()"
            [searchable]="true"
            [placeholder]="isLoadingDistricts() ? 'Loading...' : selectedProvince() ? 'Select district' : 'Select province first'"
            [disabled]="!selectedProvince() || isLoadingDistricts()"
            (change)="onDistrictChange($event)" />
        </div>
      </div>

      <div style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 6px;">
        <p style="margin: 0; color: #6b7280;">
          <strong>Selected province:</strong> {{ getProvinceName() || 'None' }}
        </p>
        <p style="margin: 8px 0 0 0; color: #6b7280;">
          <strong>Selected district:</strong> {{ getDistrictName() || 'None' }}
        </p>
      </div>

      <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          💡 <strong>Demo:</strong> Province and district data simulating API/Database loading
        </p>
      </div>
    </div>
  `
})
export class PkSelectDataExample {
  // Signals for loading states
  isLoadingProvinces = signal<boolean>(true);
  isLoadingDistricts = signal<boolean>(false);

  // Signals for options
  provinceOptions = signal<SelectOption[]>([]);
  districtOptions = signal<SelectOption[]>([]);

  // Signals for selected values
  selectedProvince = signal<string | null>(null);
  selectedDistrict = signal<string | null>(null);

  // Mock database table
  private mockProvinceTable = [
    { province_id: 1, province_name: 'Bangkok', region: 'Central' },
    { province_id: 2, province_name: 'Chiang Mai', region: 'North' },
    { province_id: 3, province_name: 'Phuket', region: 'South' },
    { province_id: 4, province_name: 'Khon Kaen', region: 'Northeast' },
    { province_id: 5, province_name: 'Songkhla', region: 'South' },
  ];

  private mockDistrictTable = [
    { district_id: 1, district_name: 'Phaya Thai', province_id: 1 },
    { district_id: 2, district_name: 'Din Daeng', province_id: 1 },
    { district_id: 3, district_name: 'Huai Khwang', province_id: 1 },
    { district_id: 4, district_name: 'Mueang Chiang Mai', province_id: 2 },
    { district_id: 5, district_name: 'Mae Rim', province_id: 2 },
    { district_id: 6, district_name: 'San Sai', province_id: 2 },
    { district_id: 7, district_name: 'Mueang Phuket', province_id: 3 },
    { district_id: 8, district_name: 'Kathu', province_id: 3 },
    { district_id: 9, district_name: 'Mueang Khon Kaen', province_id: 4 },
    { district_id: 10, district_name: 'Ban Phai', province_id: 4 },
    { district_id: 11, district_name: 'Mueang Songkhla', province_id: 5 },
    { district_id: 12, district_name: 'Hat Yai', province_id: 5 },
  ];

  constructor() {
    // Load provinces on init
    this.loadProvinces();
  }

  // Simulate loading provinces from database/API
  private loadProvinces(): void {
    this.isLoadingProvinces.set(true);
    
    // Simulate API delay
    setTimeout(() => {
      const options = this.mockProvinceTable.map(p => ({
        label: `${p.province_name} (${p.region})`,
        value: p.province_id.toString()
      }));
      
      this.provinceOptions.set(options);
      this.isLoadingProvinces.set(false);
    }, 800);
  }

  // Simulate loading districts from database/API based on province
  private loadDistricts(provinceId: string): void {
    this.isLoadingDistricts.set(true);
    this.districtOptions.set([]);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = this.mockDistrictTable.filter(
        d => d.province_id.toString() === provinceId
      );
      
      const options = filtered.map(d => ({
        label: d.district_name,
        value: d.district_id.toString()
      }));
      
      this.districtOptions.set(options);
      this.isLoadingDistricts.set(false);
    }, 500);
  }

  onProvinceChange(value: any): void {
    this.selectedProvince.set(value);
    this.selectedDistrict.set(null);
    
    if (value) {
      this.loadDistricts(value);
    } else {
      this.districtOptions.set([]);
    }
  }

  onDistrictChange(value: any): void {
    this.selectedDistrict.set(value);
  }

  getProvinceName(): string {
    const provinceId = this.selectedProvince();
    if (!provinceId) return '';
    
    const province = this.mockProvinceTable.find(
      p => p.province_id.toString() === provinceId
    );
    return province ? province.province_name : '';
  }

  getDistrictName(): string {
    const districtId = this.selectedDistrict();
    if (!districtId) return '';
    
    const district = this.mockDistrictTable.find(
      d => d.district_id.toString() === districtId
    );
    return district ? district.district_name : '';
  }
}
