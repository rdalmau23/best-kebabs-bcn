'use client';

import { useTranslations } from 'next-intl';
import type { Kebab } from '@/types';
import clsx from 'clsx';

interface KebabListProps {
  kebabs: Kebab[];
  selectedKebab: Kebab | null;
  onSelectKebab: (kebab: Kebab) => void;
}

export default function KebabList({ kebabs, selectedKebab, onSelectKebab }: KebabListProps) {
  const t = useTranslations();

  if (kebabs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {t('kebabs.noResults')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {kebabs.map((kebab) => (
        <div
          key={kebab._id}
          onClick={() => onSelectKebab(kebab)}
          className={clsx(
            'p-4 rounded-lg border-2 cursor-pointer transition-all',
            selectedKebab?._id === kebab._id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          )}
        >
          <h3 className="font-semibold text-lg text-gray-900">{kebab.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{kebab.address}</p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {kebab.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {t(`tags.${tag}`)}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold text-gray-900">
                {kebab.avgRating > 0 ? kebab.avgRating.toFixed(1) : '-'}
              </span>
              <span className="text-gray-500 text-sm">
                ({kebab.ratingsCount})
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
