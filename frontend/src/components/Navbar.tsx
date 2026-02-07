'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import authService from '@/lib/authService';
import type { User } from '@/types';
import Link from 'next/link';

export default function Navbar() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.refresh();
  };

  /**
   * Change language
   */
  const changeLanguage = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-primary-600">
            🥙 {t('common.appName')}
          </Link>

          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="flex space-x-2">
              <button
                onClick={() => changeLanguage('ca')}
                className={`px-2 py-1 rounded ${locale === 'ca' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                CA
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`px-2 py-1 rounded ${locale === 'es' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                EN
              </button>
            </div>

            {/* Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">
                      {user.username}
                      {user.role === 'admin' && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          Admin
                        </span>
                      )}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <Link
                      href={`/${locale}/login`}
                      className="px-4 py-2 text-primary-600 hover:text-primary-700 transition"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
