export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  badge?: string;
  buttonText?: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  categoryId: string;
}
