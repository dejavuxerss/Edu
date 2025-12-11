import React from 'react';
import { getSettings } from '../services/storage';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ slot = "1234567890", format = 'auto', className = "" }) => {
  const settings = getSettings();

  if (!settings.enableAds) return null;

  let sizeClass = "h-32";
  if (format === 'rectangle') sizeClass = "h-64";
  if (format === 'vertical') sizeClass = "h-[600px] w-full";

  return (
    <div className={`bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-2 text-gray-400 text-sm overflow-hidden relative group ${sizeClass} ${className}`}>
      <div className="absolute top-0 right-0 bg-gray-200 text-[10px] px-1 text-gray-500">Reklam</div>
      
      {settings.adsensePublisherId ? (
         <div className="text-center z-10">
            <span className="block font-bold text-gray-300 text-lg mb-1">GOOGLE ADSENSE</span>
            <p className="text-[10px] font-mono">ID: {settings.adsensePublisherId}</p>
         </div>
      ) : (
          <p className="text-xs">Adsense ID Girilmedi</p>
      )}
      
      {/* Pattern for visual */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
    </div>
  );
};
