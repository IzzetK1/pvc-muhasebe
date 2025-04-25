export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'partner';
  created_at: string;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  partner_id: string | null; // Ortağa ait işlem ise ortak ID'si
  created_at: string;
  updated_at: string;
};

export type Partner = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type PartnerExpense = {
  id: string;
  partner_id: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'completed' | 'cancelled';
  total_income: number;
  total_expense: number;
  created_at: string;
  updated_at: string;
};
