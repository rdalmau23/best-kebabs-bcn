'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import KebabList from '@/components/KebabList';
import KebabMap from '@/components/KebabMap';
import type { Kebab } from '@/types';
import kebabService from '@/lib/kebabService';

export default function HomePage() {
  const t = useTranslations();
  const [kebabs, setKebabs] = useState<Kebab[]>([]);
  const [selectedKebab, setSelectedKebab] = useState<Kebab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadKebabs();
  }, []);

  /**
   * Load all kebabs from API
   */
  const loadKebabs = async () => {
    try {
      setLoading(true);
      const data = await kebabService.getKebabs();
      setKebabs(data);
    } catch (err) {
      setError(t('errors.network'));
      console.error('Error loading kebabs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t('kebabs.title')}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kebab List */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-[600px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4">{t('kebabs.allKebabs')}</h2>
              <KebabList
                kebabs={kebabs}
                selectedKebab={selectedKebab}
                onSelectKebab={setSelectedKebab}
              />
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold">{t('map.title')}</h2>
              </div>
              <div className="h-[calc(600px-77px)] p-6">
                <KebabMap
                  kebabs={kebabs}
                  selectedKebab={selectedKebab}
                  onSelectKebab={setSelectedKebab}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
