'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

interface CountryCodeSelectProps {
  selectedCode: string;
  onSelect: (code: string) => void;
}

const countryCodes: CountryCode[] = [
  { code: '+86', name: '中国', flag: '🇨🇳' },
  { code: '+852', name: '香港', flag: '🇭🇰' },
  { code: '+853', name: '澳门', flag: '🇲🇴' },
  { code: '+886', name: '台湾', flag: '🇹🇼' },
  { code: '+1', name: '美国/加拿大', flag: '🇺🇸' },
  { code: '+44', name: '英国', flag: '🇬🇧' },
  { code: '+81', name: '日本', flag: '🇯🇵' },
  { code: '+82', name: '韩国', flag: '🇰🇷' },
  { code: '+65', name: '新加坡', flag: '🇸🇬' },
  { code: '+60', name: '马来西亚', flag: '🇲🇾' },
];

export function CountryCodeSelect({ selectedCode, onSelect }: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countryCodes.find(country => country.code === selectedCode) || countryCodes[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      >
        <span className="flex items-center gap-2">
          <span>{selectedCountry.flag}</span>
          <span>{selectedCountry.code}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {countryCodes.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                onSelect(country.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 ${
                selectedCode === country.code ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.code}</span>
              <span className="text-sm text-gray-500">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 