import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import KebabList from '@/components/KebabList';
import type { Kebab } from '@/types';

const messages = {
  'kebabs.noResults': 'No kebabs found',
  'tags.halal': 'Halal',
  'tags.24h': '24 hours',
};

const mockKebabs: Kebab[] = [
  {
    _id: '1',
    name: 'Kebab Istanbul',
    address: 'Carrer de la Marina 123',
    lat: 41.3851,
    lng: 2.1734,
    tags: ['halal', '24h'],
    avgRating: 4.5,
    ratingsCount: 10,
  },
];

describe('KebabList', () => {
  it('renders kebab list correctly', () => {
    const mockOnSelect = jest.fn();

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <KebabList
          kebabs={mockKebabs}
          selectedKebab={null}
          onSelectKebab={mockOnSelect}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Kebab Istanbul')).toBeInTheDocument();
    expect(screen.getByText('Carrer de la Marina 123')).toBeInTheDocument();
  });

  it('shows no results message when empty', () => {
    const mockOnSelect = jest.fn();

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <KebabList
          kebabs={[]}
          selectedKebab={null}
          onSelectKebab={mockOnSelect}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('No kebabs found')).toBeInTheDocument();
  });
});
