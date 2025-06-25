import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, DollarSign, TrendingUp, TrendingDown, User, Tag } from 'lucide-react';
import * as Chart from 'chart.js';

const CURRENT_USER_ID = '0004';
const HOST = 'http://localhost:3030';

// Реалізація виклику API
const api: any = {
  // для роботи з інформацією коритувача
  user: {
    get: async () => {
      const response = await fetch(HOST + '/api/user?id=' + CURRENT_USER_ID);
      return response.json();
    },
    update: (data: { userId: string, username: string, email: string }) => fetch(HOST + '/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, id: CURRENT_USER_ID })
    })
  },
  // для роботи з інформацією про доходи
  income: {
    get: async () => {
      const response = await fetch(HOST + '/api/income?userId=' + CURRENT_USER_ID);
      return response.json();
    },
    post: (data: any) => fetch(HOST + '/api/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, incomeId: Date.now(), userId: CURRENT_USER_ID })
    }),
    update: (data: any) => fetch(HOST + '/api/income', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, userId: CURRENT_USER_ID })
    }),
    delete: (id: string) => fetch(HOST + '/api/income?id=' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // для роботи з інформацією про витрати
  expense: {
    get: async () => {
      const response = await fetch(HOST + '/api/expense?userId=' + CURRENT_USER_ID);
      return response.json();
    },
    post: (data: any) => fetch(HOST + '/api/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, expenseId: Date.now(), userId: CURRENT_USER_ID })
    }),
    update: (data: any) => fetch(HOST + '/api/expense', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, userId: CURRENT_USER_ID })
    }),
    delete: (id: string) => fetch(HOST + '/api/expense?id=' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },

  // для роботи з інформацією про категорії доходів
  incomeCategory: {
    get: async () => {
      const response = await fetch(HOST + '/api/incomeCategory?userId=' + CURRENT_USER_ID);
      return response.json();
    },
    post: (data: any) => fetch(HOST + '/api/incomeCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, categoryId: Date.now(), userId: CURRENT_USER_ID })
    }),
    update: (data: any) => fetch(HOST + '/api/incomeCategory', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, userId: CURRENT_USER_ID })
    }),
    delete: (id: string) => fetch(HOST + '/api/incomeCategory?id=' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
  },

  // для роботи з інформацією про категорії витрат
  expenseCategory: {
    get: async () => {
      const response = await fetch(HOST + '/api/expenseCategory?userId=' + CURRENT_USER_ID);
      return response.json();
    },
    post: (data: any) => fetch(HOST + '/api/expenseCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, categoryId: Date.now(), userId: CURRENT_USER_ID })
    }),
    update: (data: any) => fetch(HOST + '/api/expenseCategory', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, userId: CURRENT_USER_ID })
    }),
    delete: (id: string) => fetch(HOST + '/api/expenseCategory?id=' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
  }
};

const BudgetApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any | null>(null);
  const [income, setIncome] = useState<any>([]);
  const [expenses, setExpenses] = useState<any>([]);
  const [incomeCategories, setIncomeCategories] = useState<any>([]);
  const [expenseCategories, setExpenseCategories] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);


  // посилання на графік
  const incomeChartRef: any = useRef(null);
  const expenseChartRef: any = useRef(null);
  const incomeChartInstance: any = useRef(null);
  const expenseChartInstance: any = useRef(null);

  // стейт для діалогового вікна
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any | null>(null);


  interface FormData {
    name?: string
    categoryName?: string
    username?: string
    description?: string
    email?: string
    amount?: number
    categoryId?: string
    date?: string
    _id?: string
  }
  // Form state
  const [formData, setFormData] = useState<FormData>({});


  const renderCharts = () => {
    // Register Chart.js components
    Chart.Chart.register(...Chart.registerables);

    // Destroy existing charts
    if (incomeChartInstance.current) {
      incomeChartInstance.current.destroy();
    }
    if (expenseChartInstance.current) {
      expenseChartInstance.current.destroy();
    }

    // Prepare income data by category
    const incomeByCategory: any = {};
    income.forEach((item: {categoryId: string, amount: number}) => {
      if (incomeByCategory[item.categoryId]) {
        incomeByCategory[item.categoryId] += item.amount;
      } else {
        incomeByCategory[item.categoryId] = item.amount;
      }
    });

    // Prepare expense data by category
    const expensesByCategory: any = {};
    expenses.forEach((item: {categoryId: string, amount: number}) => {
      if (expensesByCategory[item.categoryId]) {
        expensesByCategory[item.categoryId] += item.amount;
      } else {
        expensesByCategory[item.categoryId] = item.amount;
      }
    });

    // Income chart colors
    const incomeColors = [
      '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
      '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857'
    ];

    // Expense chart colors
    const expenseColors = [
      '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
      '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C'
    ];

    // Render income chart
    if (incomeChartRef.current && Object.keys(incomeByCategory).length > 0) {
      const ctx = incomeChartRef.current.getContext('2d');
      incomeChartInstance.current = new Chart.Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(incomeByCategory),
          datasets: [{
            data: Object.values(incomeByCategory),
            backgroundColor: incomeColors.slice(0, Object.keys(incomeByCategory).length),
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    // відображаємо графік розходів
    if (expenseChartRef.current && Object.keys(expensesByCategory).length > 0) {
      const ctx = expenseChartRef.current.getContext('2d');
      expenseChartInstance.current = new Chart.Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(expensesByCategory),
          datasets: [{
            data: Object.values(expensesByCategory),
            backgroundColor: expenseColors.slice(0, Object.keys(expensesByCategory).length),
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading && activeTab === 'dashboard') {
      renderCharts();
    }
    return () => {
      // видаляєм графіки якщо користувач переходить з головного екрану
      if (incomeChartInstance.current) {
        incomeChartInstance.current.destroy();
      }
      if (expenseChartInstance.current) {
        expenseChartInstance.current.destroy();
      }
    };
  }, [loading, activeTab, income, expenses]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, incomeData, expenseData, incomeCatData, expenseCatData] = await Promise.all([
        api.user.get(),
        api.income.get(),
        api.expense.get(),
        api.incomeCategory.get(),
        api.expenseCategory.get()
      ]);

      setUser(userData);
      setIncome(incomeData);
      setExpenses(expenseData);
      setIncomeCategories(incomeCatData);
      setExpenseCategories(expenseCatData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: any, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: any) => {
    if (e) e.preventDefault();
    try {
      if (editingItem) {
        await api[modalType].update({ ...editingItem, ...formData });
      } else {
        await api[modalType].post(formData);
      }
      await loadData();
      closeModal();
    } catch (error) {
      console.error('Помилка зберігання:', error);
    }
  };

  const handleDelete = async (type: string, id: any) => {
    if (window.confirm('Ви впевненні, що хочете видалити ці дані?')) {
      try {
        await api[type].delete(id);
        await loadData();
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
  };

  const totalIncome = income.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const renderModal = () => {
    if (!showModal) return null;

    const isCategory = modalType.includes('Category');
    const isIncome = modalType === 'income';
    const isExpense = modalType === 'expense';
    const categories = isIncome ? incomeCategories : isExpense ? expenseCategories : [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Змінити' : 'Додати'} {[
              { key: 'income', label: 'Доходи', icon: TrendingUp },
              { key: 'expense', label: 'Витрати', icon: TrendingDown },
              { key: 'user', label: 'Користувач', icon: TrendingDown },
              { key: 'incomeCategory', label: 'Категорії доходів', icon: Tag },
              { key: 'expenseCategory', label: 'Категорії витрат', icon: Tag }
            ].filter(e => e.key === modalType)[0].label}
          </h3>
          <div onSubmit={handleSubmit}>
            {isCategory ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Назва</label>
                  <input
                    type="text"
                    value={formData.categoryName || ''}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Опис</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
              </>
            ) : modalType === 'user' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Назва</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Сума</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Опис</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Категорія</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Оберіть категорію</option>
                    {categories.map((cat: { _id: string, categoryName: string }) => (
                      <option key={cat._id} value={cat._id}>{cat.categoryName || ''}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Дата</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Відмінити
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingItem ? 'Оновити' : 'Створити'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Загальний дохід</p>
              <p className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Загальні витрати</p>
              <p className="text-2xl font-bold text-red-700">${totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className={`${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'} p-6 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${balance >= 0 ? 'text-blue-600' : 'text-orange-600'} text-sm font-medium`}>Поточний баланс</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
          </div>
        </div>
      </div>

            {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Доходи по категоріям</h3>
          <div className="h-64 flex items-center justify-center">
            {income.length > 0 ? (
              <canvas ref={incomeChartRef} className="max-h-full"></canvas>
            ) : (
              <p className="text-gray-500">Даних немає</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Витрати по категоріям</h3>
          <div className="h-64 flex items-center justify-center">
            {expenses.length > 0 ? (
              <canvas ref={expenseChartRef} className="max-h-full"></canvas>
            ) : (
              <p className="text-gray-500">Даних немає</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Історія доходу</h3>
            <button
              onClick={() => openModal('income')}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {income.slice(0, 5).map((item: { id: number, description: string, category: string, date: string, amount: number }) => (
              <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
                </div>
                <p className="font-semibold text-green-600">${item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Історія розходів</h3>
            <button
              onClick={() => openModal('expense')}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {expenses.slice(0, 5).map((item: { id: number, description: string, category: string, date: string, amount: number }) => (
              <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
                </div>
                <p className="font-semibold text-red-600">${item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTable = (data: any, type: string, categories = []) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize">{[
              { key: 'dashboard', label: 'Головна', icon: DollarSign },
              { key: 'income', label: 'Доходи', icon: TrendingUp },
              { key: 'expense', label: 'Витрати', icon: TrendingDown },
              { key: 'incomeCategory', label: 'Категорії доходів', icon: Tag },
              { key: 'expenseCategory', label: 'Категорії витрат', icon: Tag }
            ].filter(e => e.key === type)[0].label}</h3>
          <button
            onClick={() => openModal(type)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Додати {[
              { key: 'dashboard', label: 'Головна', icon: DollarSign },
              { key: 'income', label: 'Доходи', icon: TrendingUp },
              { key: 'expense', label: 'Витрати', icon: TrendingDown },
              { key: 'incomeCategory', label: 'Категорії доходів', icon: Tag },
              { key: 'expenseCategory', label: 'Категорії витрат', icon: Tag }
            ].filter(e => e.key === type)[0].label}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {type.includes('Category') ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Опис</th>
                </>
              ) : type === 'user' ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Опис</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сума</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категорія</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item: { _id: string, description: string, name: string, categoryName: string, email: string, category: string, date: string, amount: number }) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {type.includes('Category') ? (
                  <>
                    <td className="px-6 py-4 text-sm font-medium">{item.categoryName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                  </>
                ) : type === 'user' ? (
                  <>
                    <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm font-medium">{item.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        ${item.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                  </>
                )}
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(type, item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(type, item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">Budget Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Доброго дня, {user?.username}</span>
              <button
                onClick={() => openModal('user', user)}
                className="text-gray-500 hover:text-gray-700"
              >
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            {[
              { key: 'dashboard', label: 'Головна', icon: DollarSign },
              { key: 'income', label: 'Доходи', icon: TrendingUp },
              { key: 'expense', label: 'Витрати', icon: TrendingDown },
              { key: 'incomeCategory', label: 'Категорії доходів', icon: Tag },
              { key: 'expenseCategory', label: 'Категорії витрат', icon: Tag }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'income' && renderDataTable(income, 'income', incomeCategories)}
        {activeTab === 'expense' && renderDataTable(expenses, 'expense', expenseCategories)}
        {activeTab === 'incomeCategory' && renderDataTable(incomeCategories, 'incomeCategory')}
        {activeTab === 'expenseCategory' && renderDataTable(expenseCategories, 'expenseCategory')}
      </div>

      {renderModal()}
    </div>
  );
};

export default BudgetApp;