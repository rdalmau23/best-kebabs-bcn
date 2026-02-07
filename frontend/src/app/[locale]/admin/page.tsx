'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import authService from '@/lib/authService';
import kebabService from '@/lib/kebabService';
import { updateKebab, deleteKebab, getAllRatings, deleteRating } from '@/lib/adminService';
import { getAllUsers } from '@/lib/userService';

type Tab = 'kebabs' | 'users' | 'ratings';

export default function AdminPage() {
  const t = useTranslations();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('kebabs');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (!userData || userData.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(userData);
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">{t('admin.title')}</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('kebabs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kebabs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.tabs.kebabs')}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.tabs.users')}
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ratings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.tabs.ratings')}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'kebabs' && <KebabsTab t={t} />}
        {activeTab === 'users' && <UsersTab t={t} />}
        {activeTab === 'ratings' && <RatingsTab t={t} />}
      </div>
    </div>
  );
}

// Kebabs Tab
function KebabsTab({ t }: { t: any }) {
  const [kebabs, setKebabs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingKebab, setEditingKebab] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    tags: '',
  });

  useEffect(() => {
    loadKebabs();
  }, []);

  const loadKebabs = async () => {
    try {
      const data = await kebabService.getKebabs();
      setKebabs(data);
    } catch (err) {
      console.error('Failed to load kebabs', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kebabData = {
        name: formData.name,
        address: formData.address,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) as any,
      };

      if (editingKebab) {
        await updateKebab(editingKebab._id, kebabData);
      } else {
        await kebabService.createKebab(kebabData);
      }

      setShowForm(false);
      setEditingKebab(null);
      setFormData({ name: '', address: '', lat: '', lng: '', tags: '' });
      loadKebabs();
    } catch (err) {
      console.error('Failed to save kebab', err);
    }
  };

  const handleEdit = (kebab: any) => {
    setEditingKebab(kebab);
    setFormData({
      name: kebab.name,
      address: kebab.address,
      lat: kebab.lat.toString(),
      lng: kebab.lng.toString(),
      tags: kebab.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteKebab(id);
      loadKebabs();
    } catch (err) {
      console.error('Failed to delete kebab', err);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingKebab(null);
          setFormData({ name: '', address: '', lat: '', lng: '', tags: '' });
        }}
        className="mb-6 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
      >
        {showForm ? t('admin.cancel') : t('admin.createKebab')}
      </button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            {editingKebab ? t('admin.editKebab') : t('admin.createKebab')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t('admin.kebabName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder={t('admin.kebabAddress')}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                placeholder={t('admin.latitude')}
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                step="any"
                placeholder={t('admin.longitude')}
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <input
              type="text"
              placeholder={t('admin.tags')}
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
            >
              {editingKebab ? t('admin.update') : t('admin.create')}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t('admin.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t('admin.address')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t('admin.rating')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kebabs.map((kebab) => (
              <tr key={kebab._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{kebab.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{kebab.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ⭐ {kebab.avgRating.toFixed(1)} ({kebab.ratingsCount})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(kebab)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    {t('admin.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(kebab._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {t('admin.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users Tab
function UsersTab({ t }: { t: any }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.username')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.email')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.role')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.joined')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{user.username}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Ratings Tab
function RatingsTab({ t }: { t: any }) {
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const data = await getAllRatings();
      setRatings(data);
    } catch (err) {
      console.error('Failed to load ratings', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteRating(id);
      loadRatings();
    } catch (err) {
      console.error('Failed to delete rating', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.user')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.kebab')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.score')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('admin.comment')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              {t('admin.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ratings.map((rating: any) => (
            <tr key={rating._id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {rating.userId?.username || 'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {rating.kebabId?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">⭐ {rating.score}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {rating.comment || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(rating._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  {t('admin.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
