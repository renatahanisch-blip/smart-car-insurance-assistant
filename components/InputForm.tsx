import React from 'react';
import { InsuranceFormData, AVAILABLE_PROVIDERS } from '../types';
import { 
  Car, 
  User, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  Zap,
  Briefcase,
  RotateCcw,
  Database,
  CreditCard,
  Flag,
  Building,
  Wrench
} from 'lucide-react';

interface InputFormProps {
  formData: InsuranceFormData;
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, onReset, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProviderToggle = (provider: string) => {
    setFormData(prev => {
        const current = prev.selectedProviders;
        if (current.includes(provider)) {
            return { ...prev, selectedProviders: current.filter(p => p !== provider) };
        } else {
            return { ...prev, selectedProviders: [...current, provider] };
        }
    });
  };

  // Mock CRM Data Handlers
  const handleCrmCustomer = () => {
    setFormData(prev => ({
      ...prev,
      lastName: 'Muster',
      firstName: 'Felix',
      nationality: 'CH',
      permitType: '',
      licenseDate: '2003-05-15',
      zipCode: '8000',
      city: 'Zürich',
      birthDate: '1985-05-15',
      claimsHP: 0,
      claimsVK: 1
    }));
  };

  const handleCrmVehicle = () => {
    setFormData(prev => ({
      ...prev,
      makeModel: 'Audi Q4 e-tron 40',
      catalogPrice: 68500,
      powerKw: 150,
      annualMileage: 15000,
      youngDriver: false,
      usage: 'private',
      garageName: 'AMAG Zürich',
      garageContact: 'verkauf.zuerich@amag.ch'
    }));
  };

  const handleCrmCoverage = () => {
    setFormData(prev => ({
      ...prev,
      coverageType: 'vollkasko',
      deductibleLiability: 0,
      deductibleCollision: 1000,
      deductiblePartial: 0,
      bonusProtection: true,
      grossNegligence: true,
      parkingDamage: true,
      assistance: true
    }));
  };

  const labelClass = "block text-sm font-medium text-slate-600 mb-1";
  const inputClass = "w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const checkboxClass = "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded";
  const crmButtonClass = "text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors border border-blue-200 font-medium";

  // Check if nationality is Swiss (case insensitive)
  const isSwiss = formData.nationality.trim().toUpperCase() === 'CH' || formData.nationality.trim().toUpperCase() === 'SCHWEIZ';

  return (
    <div className="space-y-6">
      {/* Customer Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-blue-600">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Versicherungsnehmer
            </h3>
            <button onClick={handleCrmCustomer} className={crmButtonClass} title="Daten aus CRM laden">
                <Database className="w-3.5 h-3.5" />
                CRM Import
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1: Name / Vorname */}
          <div>
            <label className={labelClass}>Vorname</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="z.B. Felix"
            />
          </div>
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="z.B. Muster"
            />
          </div>

          {/* Row 2: Nationalität / Bewilligung */}
          <div>
            <label className={labelClass}>Nationalität</label>
            <div className="relative">
                <Flag className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    placeholder="z.B. CH"
                />
            </div>
          </div>
          
          {!isSwiss && (
            <div>
                <label className={labelClass}>Bewilligung</label>
                <select
                name="permitType"
                value={formData.permitType}
                onChange={handleChange}
                className={inputClass}
                >
                <option value="">Bitte wählen...</option>
                <option value="B">B (Aufenthalter)</option>
                <option value="C">C (Niederlassung)</option>
                <option value="F">F (Vorläufig)</option>
                <option value="L">L (Kurzzeit)</option>
                <option value="G">G (Grenzgänger)</option>
                </select>
            </div>
          )}

           {/* Row 3: Birthdate / License Date */}
          <div>
            <label className={labelClass}>Geburtsdatum (VN)</label>
            <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                />
            </div>
          </div>
          <div>
            <label className={labelClass}>Führerausweis seit</label>
            <div className="relative">
                <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="date"
                    name="licenseDate"
                    value={formData.licenseDate}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                />
            </div>
          </div>

          {/* Row 4: Address */}
          <div>
            <label className={labelClass}>Postleitzahl</label>
            <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    placeholder="z.B. 8000"
                />
            </div>
          </div>
          <div>
            <label className={labelClass}>Wohnort</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              placeholder="z.B. Zürich"
            />
          </div>

          {/* Row 5: Claims */}
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <div>
                <label className={labelClass}>Haftpflicht Schäden (5J)</label>
                <input
                    type="number"
                    name="claimsHP"
                    min="0"
                    value={formData.claimsHP}
                    onChange={handleChange}
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Kasko Schäden (5J)</label>
                <input
                    type="number"
                    name="claimsVK"
                    min="0"
                    value={formData.claimsVK}
                    onChange={handleChange}
                    className={inputClass}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-blue-600">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Fahrzeug
            </h3>
            <button onClick={handleCrmVehicle} className={crmButtonClass} title="Daten aus CRM laden">
                <Database className="w-3.5 h-3.5" />
                CRM Import
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Marke & Modell</label>
            <input
              type="text"
              name="makeModel"
              value={formData.makeModel}
              onChange={handleChange}
              className={inputClass}
              placeholder="z.B. VW Golf VIII GTI"
            />
          </div>
          <div>
            <label className={labelClass}>Katalogpreis (CHF)</label>
            <input
              type="number"
              name="catalogPrice"
              value={formData.catalogPrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Leistung (kW)</label>
            <div className="relative">
                <Zap className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="number"
                    name="powerKw"
                    value={formData.powerKw}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                />
            </div>
          </div>
          <div>
            <label className={labelClass}>Jahres-KM</label>
            <input
              type="number"
              name="annualMileage"
              value={formData.annualMileage}
              onChange={handleChange}
              step="500"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Nutzung</label>
            <div className="relative">
                <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <select
                    name="usage"
                    value={formData.usage}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                >
                    <option value="private">Privat</option>
                    <option value="business">Geschäftlich</option>
                </select>
            </div>
          </div>
          
          {/* Garage Info */}
          <div>
            <label className={labelClass}>Garagist</label>
            <div className="relative">
                <Wrench className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    name="garageName"
                    value={formData.garageName}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    placeholder="Garage Name"
                />
            </div>
          </div>
          <div>
            <label className={labelClass}>Telefonnummer oder E-Mail</label>
            <input
                type="text"
                name="garageContact"
                value={formData.garageContact}
                onChange={handleChange}
                className={inputClass}
                placeholder="Tel. oder E-Mail des Garagisten"
            />
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-md border border-amber-100 md:col-span-2">
            <input
              type="checkbox"
              name="youngDriver"
              id="youngDriver"
              checked={formData.youngDriver}
              onChange={handleChange}
              className={checkboxClass}
            />
            <label htmlFor="youngDriver" className="text-sm font-medium text-amber-800 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Häufigster Lenker unter 26 Jahre?
            </label>
          </div>
        </div>
      </div>

      {/* Coverage Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-blue-600">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Deckung
            </h3>
            <button onClick={handleCrmCoverage} className={crmButtonClass} title="Daten aus CRM laden">
                <Database className="w-3.5 h-3.5" />
                CRM Import
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className={labelClass}>Kasko-Deckung</label>
                <select
                    name="coverageType"
                    value={formData.coverageType}
                    onChange={handleChange}
                    className={inputClass}
                >
                    <option value="haftpflicht">Nur Haftpflicht</option>
                    <option value="teilkasko">Teilkasko</option>
                    <option value="vollkasko">Vollkasko</option>
                </select>
            </div>
            <div>
                <label className={labelClass}>SB Haftpflicht (CHF)</label>
                <select name="deductibleLiability" value={formData.deductibleLiability} onChange={handleChange} className={inputClass}>
                    <option value={0}>0</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select>
            </div>
            <div>
                <label className={labelClass}>SB Kollision (CHF)</label>
                <select name="deductibleCollision" value={formData.deductibleCollision} onChange={handleChange} className={inputClass}>
                    <option value={0}>0</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                    <option value={2000}>2000</option>
                </select>
            </div>
            <div>
                <label className={labelClass}>SB Teilkasko (CHF)</label>
                <select name="deductiblePartial" value={formData.deductiblePartial} onChange={handleChange} className={inputClass}>
                    <option value={0}>0</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center space-x-2">
                <input type="checkbox" name="bonusProtection" id="bonusProtection" checked={formData.bonusProtection} onChange={handleChange} className={checkboxClass} />
                <label htmlFor="bonusProtection" className="text-sm text-slate-700">Bonusschutz</label>
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" name="grossNegligence" id="grossNegligence" checked={formData.grossNegligence} onChange={handleChange} className={checkboxClass} />
                <label htmlFor="grossNegligence" className="text-sm text-slate-700">Grobfahrlässigkeit</label>
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" name="parkingDamage" id="parkingDamage" checked={formData.parkingDamage} onChange={handleChange} className={checkboxClass} />
                <label htmlFor="parkingDamage" className="text-sm text-slate-700">Parkschaden</label>
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" name="assistance" id="assistance" checked={formData.assistance} onChange={handleChange} className={checkboxClass} />
                <label htmlFor="assistance" className="text-sm text-slate-700">Assistance</label>
            </div>
        </div>
      </div>

      {/* Provider Selection Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-blue-600">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Anbieter-Auswahl
            </h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">Wählen Sie die Gesellschaften für die Offert-Erstellung:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {AVAILABLE_PROVIDERS.map((provider) => (
                <div key={provider} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-slate-50 cursor-pointer" onClick={() => handleProviderToggle(provider)}>
                    <input 
                        type="checkbox" 
                        id={`provider-${provider}`}
                        checked={formData.selectedProviders.includes(provider)}
                        onChange={() => handleProviderToggle(provider)}
                        className={checkboxClass}
                    />
                    <label htmlFor={`provider-${provider}`} className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        {provider}
                    </label>
                </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
            onClick={onReset}
            disabled={isLoading}
            className="px-6 py-4 rounded-lg font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
            <RotateCcw className="w-5 h-5" />
            Reset
        </button>

        <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`flex-1 py-4 rounded-lg font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2
            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}
            `}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analysiere...
                </>
            ) : (
                'Analyse Generieren'
            )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;