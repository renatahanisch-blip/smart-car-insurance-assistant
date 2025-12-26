export interface InsuranceFormData {
  // Customer
  lastName: string;
  firstName: string;
  nationality: string;
  permitType: string; // 'B', 'C', 'F', 'L', 'G', or empty
  licenseDate: string; // Date of driving license
  zipCode: string;
  city: string;
  birthDate: string;
  claimsHP: number; // Liability claims in last 5 years
  claimsVK: number; // Collision claims in last 5 years
  
  // Vehicle
  makeModel: string;
  catalogPrice: number;
  powerKw: number;
  annualMileage: number;
  youngDriver: boolean; // < 26 years
  usage: 'private' | 'business';
  garageName: string; // New field: Garagist
  garageContact: string; // New field: Contact info for garage
  
  // Coverage
  coverageType: 'haftpflicht' | 'teilkasko' | 'vollkasko';
  deductibleLiability: number; // New field: Liability Deductible
  deductibleCollision: number;
  deductiblePartial: number;
  bonusProtection: boolean;
  grossNegligence: boolean;
  parkingDamage: boolean;
  assistance: boolean;

  // Providers
  selectedProviders: string[];
}

export const AVAILABLE_PROVIDERS = [
  'Allianz',
  'AXA',
  'Emmentaler',
  'Generali',
  'Helvetia Baloise',
  'Mobiliar',
  'Vaudoise',
  'Zurich'
];

export const INITIAL_FORM_DATA: InsuranceFormData = {
  lastName: '',
  firstName: '',
  nationality: 'CH',
  permitType: '',
  licenseDate: '',
  zipCode: '',
  city: '',
  birthDate: '',
  claimsHP: 0,
  claimsVK: 0,
  makeModel: '',
  catalogPrice: 0,
  powerKw: 0,
  annualMileage: 10000,
  youngDriver: false,
  usage: 'private',
  garageName: '',
  garageContact: '',
  coverageType: 'vollkasko',
  deductibleLiability: 0, // Default 0
  deductibleCollision: 1000, // Default 1000
  deductiblePartial: 0,
  bonusProtection: true, // Default true
  grossNegligence: true, // Default true
  parkingDamage: false,
  assistance: false,
  selectedProviders: ['Allianz', 'AXA', 'Helvetia Baloise', 'Zurich'], // Default selection
};