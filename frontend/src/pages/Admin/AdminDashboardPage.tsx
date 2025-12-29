import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, type ChartData, type ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { dashboardService, type DashboardData } from '../../api/dashboardApiService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [days, setDays] = useState(30);
  const [groupBy, setGroupBy] = useState<'day' | 'month'>('day');

  useEffect(() => {
    fetchDashboard();
  }, [days, groupBy]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await dashboardService.getDashboard({
        days,
        group_by: groupBy,
        stock_threshold: 10,
      });
      setData(dashboardData);
    } catch (error: any) {
      toast.error('Không thể tải dữ liệu dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const revenueChartData: ChartData<'line'> = {
    labels: data.revenue_by_time.map((item) =>
      formatDate(
        item.date,
        groupBy === 'month'
          ? { month: 'short', year: 'numeric' }
          : undefined,
      ),
    ),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.revenue_by_time.map((item) => item.revenue),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
      {
        label: 'Số đơn',
        data: data.revenue_by_time.map((item) => item.orders),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        tension: 0.35,
        yAxisID: 'y1',
        fill: false,
        pointRadius: 3,
      },
    ],
  };

  const revenueChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = typeof context.parsed.y === 'number' ? context.parsed.y : Number(context.parsed.y);
            if (context.dataset.label === 'Doanh thu') {
              return `${context.dataset.label}: ${formatCurrency(value)}`;
            }
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Doanh thu' },
        ticks: {
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Số đơn' },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Dashboard Quản Trị</h1>
          <div className="flex gap-3">
            <select 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={7}>7 ngày</option>
              <option value={30}>30 ngày</option>
              <option value={90}>90 ngày</option>
              <option value={365}>1 năm</option>
            </select>
            <select 
              value={groupBy} 
              onChange={(e) => setGroupBy(e.target.value as 'day' | 'month')}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium text-indigo-100 mb-2">Tổng Doanh Thu</h3>
            <p className="text-3xl font-bold mb-2">{formatCurrency(data.overview.revenue_total)}</p>
            <p className="text-sm text-indigo-100">{data.overview.period_days} ngày qua</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium text-red-100 mb-2">Tổng Đơn Hàng</h3>
            <p className="text-3xl font-bold mb-2">{data.overview.orders_total}</p>
            <p className="text-sm text-red-100">Đơn đã hoàn thành</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium text-blue-100 mb-2">Giá Trị TB/Đơn</h3>
            <p className="text-3xl font-bold mb-2">{formatCurrency(data.overview.avg_order_value)}</p>
            <p className="text-sm text-blue-100">Trung bình</p>
          </div>
        </div>

        {/* Revenue by Time */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Doanh Thu Theo Thời Gian</h2>
            <p className="text-sm text-gray-500">Biểu đồ (trái) + 10 bản ghi gần nhất (phải)</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 min-h-[320px]">
              {data.revenue_by_time.length ? (
                <Line data={revenueChartData} options={revenueChartOptions} />
              ) : (
                <p className="text-sm text-gray-500">Chưa có dữ liệu doanh thu.</p>
              )}
            </div>
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Doanh Thu</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số Đơn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.revenue_by_time.slice(-10).reverse().map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(item.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.revenue)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products & Revenue by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Sản Phẩm Bán Chạy</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sản Phẩm</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Doanh Thu</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Đã Bán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.top_products.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{product.product_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(product.revenue)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Doanh Thu Theo Danh Mục</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Danh Mục</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Doanh Thu</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số Lượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.revenue_by_category.map((cat, index) => (
                    <tr key={cat.category_id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{cat.category_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(cat.revenue)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{cat.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Status & Low Stock Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Trạng Thái Đơn Hàng</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số Lượng</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tổng Giá Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.order_status.map((status) => (
                    <tr key={status.status} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status.status)}`}>
                          {getStatusLabel(status.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{status.count}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(status.total_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚠️</span>
              <span>Cảnh Báo Tồn Kho Thấp</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sản Phẩm</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tồn Kho</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Đã Bán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.low_stock_products.length > 0 ? (
                    data.low_stock_products.map((product) => (
                      <tr key={product.id} className="hover:bg-red-50 bg-red-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-sm font-bold text-red-600">{product.stock}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{product.sold}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                        Tất cả sản phẩm đều có đủ tồn kho
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
