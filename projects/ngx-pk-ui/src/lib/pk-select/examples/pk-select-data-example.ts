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
            เลือกจังหวัด
          </label>
          <pk-select
            [options]="provinceOptions()"
            [searchable]="true"
            [placeholder]="isLoadingProvinces() ? 'กำลังโหลด...' : 'เลือกจังหวัด'"
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
            [placeholder]="isLoadingDistricts() ? 'กำลังโหลด...' : selectedProvince() ? 'เลือกอำเภอ' : 'เลือกจังหวัดก่อน'"
            [disabled]="!selectedProvince() || isLoadingDistricts()"
            (change)="onDistrictChange($event)" />
        </div>
      </div>

      <div style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 6px;">
        <p style="margin: 0; color: #6b7280;">
          <strong>จังหวัดที่เลือก:</strong> {{ getProvinceName() || 'ยังไม่ได้เลือก' }}
        </p>
        <p style="margin: 8px 0 0 0; color: #6b7280;">
          <strong>อำเภอที่เลือก:</strong> {{ getDistrictName() || 'ยังไม่ได้เลือก' }}
        </p>
      </div>

      <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          💡 <strong>Demo:</strong> ข้อมูลจังหวัดและอำเภอจำลองการโหลดจาก API/Database
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
    { province_id: 1, province_name: 'กรุงเทพมหานคร', region: 'กลาง' },
    { province_id: 2, province_name: 'เชียงใหม่', region: 'เหนือ' },
    { province_id: 3, province_name: 'ภูเก็ต', region: 'ใต้' },
    { province_id: 4, province_name: 'ขอนแก่น', region: 'อีสาน' },
    { province_id: 5, province_name: 'สงขลา', region: 'ใต้' },
  ];

  private mockDistrictTable = [
    { district_id: 1, district_name: 'พญาไท', province_id: 1 },
    { district_id: 2, district_name: 'ดินแดง', province_id: 1 },
    { district_id: 3, district_name: 'ห้วยขวาง', province_id: 1 },
    { district_id: 4, district_name: 'เมืองเชียงใหม่', province_id: 2 },
    { district_id: 5, district_name: 'แม่ริม', province_id: 2 },
    { district_id: 6, district_name: 'สันทราย', province_id: 2 },
    { district_id: 7, district_name: 'เมืองภูเก็ต', province_id: 3 },
    { district_id: 8, district_name: 'กะทู้', province_id: 3 },
    { district_id: 9, district_name: 'เมืองขอนแก่น', province_id: 4 },
    { district_id: 10, district_name: 'บ้านไผ่', province_id: 4 },
    { district_id: 11, district_name: 'เมืองสงขลา', province_id: 5 },
    { district_id: 12, district_name: 'หาดใหญ่', province_id: 5 },
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
