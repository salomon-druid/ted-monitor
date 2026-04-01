'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyProfile, CompanyProfile } from '@/context/CompanyProfileContext';

const CPV_KEYS = [
  { code: '45000000', key: 'profileSetup.cpv_bau' },
  { code: '72000000', key: 'profileSetup.cpv_it' },
  { code: '50000000', key: 'profileSetup.cpv_facility' },
  { code: '73000000', key: 'profileSetup.cpv_beratung' },
  { code: '33000000', key: 'profileSetup.cpv_medical' },
  { code: '09000000', key: 'profileSetup.cpv_energy' },
  { code: '35000000', key: 'profileSetup.cpv_security' },
  { code: '60000000', key: 'profileSetup.cpv_transport' },
  { code: '80000000', key: 'profileSetup.cpv_bildung' },
  { code: '32000000', key: 'profileSetup.cpv_telecom' },
  { code: '48000000', key: 'profileSetup.cpv_software' },
  { code: '71000000', key: 'profileSetup.cpv_architektur' },
];

const COUNTRY_KEYS = [
  { code: 'DE', key: 'profileSetup.country_de' },
  { code: 'AT', key: 'profileSetup.country_at' },
  { code: 'CH', key: 'profileSetup.country_ch' },
  { code: 'FR', key: 'profileSetup.country_fr' },
  { code: 'NL', key: 'profileSetup.country_nl' },
  { code: 'BE', key: 'profileSetup.country_be' },
  { code: 'IT', key: 'profileSetup.country_it' },
  { code: 'ES', key: 'profileSetup.country_es' },
  { code: 'PL', key: 'profileSetup.country_pl' },
  { code: 'CZ', key: 'profileSetup.country_cz' },
  { code: 'SE', key: 'profileSetup.country_se' },
  { code: 'DK', key: 'profileSetup.country_dk' },
  { code: 'IE', key: 'profileSetup.country_ie' },
  { code: 'PT', key: 'profileSetup.country_pt' },
  { code: 'FI', key: 'profileSetup.country_fi' },
  { code: 'RO', key: 'profileSetup.country_ro' },
];

interface ProfileSetupModalProps {
  onClose: () => void;
}

export default function ProfileSetupModal({ onClose }: ProfileSetupModalProps) {
  const { t } = useLanguage();
  const { setProfile } = useCompanyProfile();

  const [companyName, setCompanyName] = useState('');
  const [selectedCpvs, setSelectedCpvs] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  function toggleCpv(code: string) {
    setSelectedCpvs(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  }

  function toggleCountry(code: string) {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  }

  function handleSave() {
    const profile: CompanyProfile = {
      company_name: companyName,
      cpv_codes: selectedCpvs,
      countries: selectedCountries,
      keywords: keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
      min_value: minValue ? Number(minValue) : undefined,
      max_value: maxValue ? Number(maxValue) : undefined,
    };
    setProfile(profile);
    onClose();
  }

  const isValid = selectedCpvs.length > 0 || selectedCountries.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark">
                {t('profileSetup.title')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t('profileSetup.subtitle')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
              {t('profileSetup.companyName')}
            </label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder={t('profileSetup.companyNamePlaceholder')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* CPV Categories */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
              {t('profileSetup.industries')}
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CPV_KEYS.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => toggleCpv(opt.code)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left ${
                    selectedCpvs.includes(opt.code)
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t(opt.key)}
                  <span className="block text-[10px] text-gray-400 mt-0.5">{opt.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
              {t('profileSetup.activeCountries')}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {COUNTRY_KEYS.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => toggleCountry(opt.code)}
                  className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    selectedCountries.includes(opt.code)
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                  title={t(opt.key)}
                >
                  {opt.code}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
              {t('profileSetup.keywords')}
              <span className="text-gray-400 font-normal ml-1">
                {t('profileSetup.optional')}
              </span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder={t('profileSetup.keywordsPlaceholder')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              {t('profileSetup.commaSeparated')}
            </p>
          </div>

          {/* Value Range */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
              {t('profileSetup.contractValue')}
              <span className="text-gray-400 font-normal ml-1">
                {t('profileSetup.optional')}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minValue}
                onChange={e => setMinValue(e.target.value)}
                placeholder="Min."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number"
                value={maxValue}
                onChange={e => setMaxValue(e.target.value)}
                placeholder="Max."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {t('profileSetup.skip')}
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
              isValid
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('profileSetup.saveProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}
