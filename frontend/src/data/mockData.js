/**
 * Production-quality dataset for Freelance Developer Dashboard
 * Contains 15 realistic freelance development projects with new partner clients,
 * realistic hourly rates, revenues, project statuses, and dates.
 */

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    message: '🎉 Pencapaian baru: 100M Revenue berhasil diraih! Total omset Anda telah melampaui Rp 100 Juta.',
    time: '10 menit yang lalu',
    read: false,
  },
  {
    id: 2,
    message: '💼 Pembayaran invoice INV-2026-001 dari BCA Digital (blu) sebesar Rp 19.500.000 telah terverifikasi.',
    time: '1 jam yang lalu',
    read: false,
  },
  {
    id: 3,
    message: '⏱️ Deadline proyek "Fleet Fuel Consumption IoT Sensor Dashboard" tersisa 3 hari kerja.',
    time: '3 jam yang lalu',
    read: false,
  },
  {
    id: 4,
    message: '⭐ Klien Pertamina Digital Solution memberikan ulasan bintang 5 untuk milestone arsitektur sistem.',
    time: 'Kemarin',
    read: true,
  },
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'rev_100m',
    title: '100M Revenue',
    desc: 'Mencapai total omset Rp 100 Juta',
    icon: '🏆',
    unlocked: true,
  },
  {
    id: 'proj_50',
    title: '50 Projects Completed',
    desc: 'Menyelesaikan 50 proyek freelance',
    icon: '🎉',
    unlocked: false,
  },
  {
    id: 'client_gold',
    title: 'Top Client Gold',
    desc: 'Mendapat predikat bintang dari klien utama (> Rp 20 Jt)',
    icon: '⭐',
    unlocked: true,
  },
];

export const DUMMY_PROJECTS = [
  {
    id: 1,
    name: 'BCA OneKlik & QRIS Payment Gateway Module',
    client: 'BCA Digital (blu)',
    revenue: 19500000,
    hours: 38,
    status: 'completed',
    priority: 'high',
    start_date: '2026-10-01',
    end_date: '2026-10-18',
  },
  {
    id: 2,
    name: 'Fleet Fuel Consumption IoT Sensor Dashboard',
    client: 'Pertamina Digital Solution',
    revenue: 24000000,
    hours: 45,
    status: 'pending',
    priority: 'high',
    start_date: '2026-10-03',
    end_date: '2026-10-25',
  },
  {
    id: 3,
    name: 'Telemedicine Electronic Prescription Sync API',
    client: 'Kalbe Farma HealthTech',
    revenue: 16500000,
    hours: 32,
    status: 'completed',
    priority: 'medium',
    start_date: '2026-09-20',
    end_date: '2026-10-05',
  },
  {
    id: 4,
    name: 'Multi-Store POS Real-time Inventory Engine',
    client: 'Indomaret Retail Nusantara',
    revenue: 22000000,
    hours: 42,
    status: 'pending',
    priority: 'high',
    start_date: '2026-10-02',
    end_date: '2026-10-22',
  },
  {
    id: 5,
    name: 'Passenger QR Ticketing & Turnstile Scanner',
    client: 'KAI Commuter Tech',
    revenue: 21000000,
    hours: 40,
    status: 'completed',
    priority: 'high',
    start_date: '2026-09-15',
    end_date: '2026-10-02',
  },
  {
    id: 6,
    name: 'Doctor Telehealth Consultation & EMR Web Portal',
    client: 'Alodokter Telehealth',
    revenue: 14500000,
    hours: 28,
    status: 'pending',
    priority: 'medium',
    start_date: '2026-10-04',
    end_date: '2026-10-19',
  },
  {
    id: 7,
    name: 'Delivery Fleet Route Optimization & Geolocation API',
    client: 'SiCepat Ekspres Indonesia',
    revenue: 18000000,
    hours: 35,
    status: 'completed',
    priority: 'high',
    start_date: '2026-09-25',
    end_date: '2026-10-10',
  },
  {
    id: 8,
    name: 'Multi-Asset Portfolio Tracker & Live Crypto Feed',
    client: 'Pluang Investama Tech',
    revenue: 17500000,
    hours: 34,
    status: 'pending',
    priority: 'medium',
    start_date: '2026-10-06',
    end_date: '2026-10-24',
  },
  {
    id: 9,
    name: 'Mobile App Omnichannel Ordering & Loyalty Reward',
    client: 'Kopi Kenangan Group',
    revenue: 15000000,
    hours: 30,
    status: 'completed',
    priority: 'medium',
    start_date: '2026-09-18',
    end_date: '2026-10-04',
  },
  {
    id: 10,
    name: 'Flight & Hotel Booking Dynamic Pricing Algorithm',
    client: 'Tiket.com (Djarum Group)',
    revenue: 23500000,
    hours: 46,
    status: 'on-hold',
    priority: 'high',
    start_date: '2026-09-28',
    end_date: '2026-10-20',
  },
  {
    id: 11,
    name: 'Corporate Bulk Payout & Dispute Resolution Panel',
    client: 'Flip Indonesia',
    revenue: 19000000,
    hours: 36,
    status: 'pending',
    priority: 'high',
    start_date: '2026-10-05',
    end_date: '2026-10-26',
  },
  {
    id: 12,
    name: 'Adaptive Quiz Engine & Video Learning Player',
    client: 'Zenius Education',
    revenue: 13500000,
    hours: 26,
    status: 'completed',
    priority: 'low',
    start_date: '2026-09-12',
    end_date: '2026-09-30',
  },
  {
    id: 13,
    name: 'Vaccine Cold-Chain IoT Temperature Monitoring',
    client: 'Bio Farma Life Science',
    revenue: 26000000,
    hours: 48,
    status: 'pending',
    priority: 'high',
    start_date: '2026-10-08',
    end_date: '2026-10-28',
  },
  {
    id: 14,
    name: 'DRM E-Book Reader & Digital Library Subscription',
    client: 'Gramedia Digital',
    revenue: 14000000,
    hours: 28,
    status: 'completed',
    priority: 'medium',
    start_date: '2026-09-22',
    end_date: '2026-10-12',
  },
  {
    id: 15,
    name: 'Smart Coffee Machine Telemetry & Mobile App API',
    client: 'Fore Coffee Indonesia',
    revenue: 16000000,
    hours: 31,
    status: 'pending',
    priority: 'medium',
    start_date: '2026-10-07',
    end_date: '2026-10-27',
  },
];

/**
 * Generate dummy aggregation for daily chart, weekly chart, and client distribution
 */
export function getCalculatedMockData() {
  const totalRevenue = DUMMY_PROJECTS.reduce((acc, p) => acc + (parseFloat(p.revenue) || 0), 0);
  const target = 100000000; // 100M Target
  const achievement = Math.min((totalRevenue / target) * 100, 100);
  const avgDaily = Math.round(totalRevenue / 30);

  // Group by client
  const clientMap = {};
  DUMMY_PROJECTS.forEach((p) => {
    clientMap[p.client] = (clientMap[p.client] || 0) + (parseFloat(p.revenue) || 0);
  });
  const clientChart = Object.entries(clientMap).map(([client, total]) => ({ client, total }));

  // Group by day 1..30
  const dailyChart = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    total: 0,
  }));
  DUMMY_PROJECTS.forEach((p) => {
    const day = parseInt(p.start_date.split('-')[2] || '1', 10);
    const dayIdx = Math.min(day - 1, 29);
    dailyChart[dayIdx].total += parseFloat(p.revenue) || 0;
  });

  // Group by week 1..4
  const weeklyChart = Array.from({ length: 4 }, (_, i) => ({
    week: i + 1,
    total: 0,
  }));
  dailyChart.forEach((d, idx) => {
    const weekIdx = Math.min(Math.floor(idx / 7), 3);
    weeklyChart[weekIdx].total += d.total;
  });

  return {
    projects: DUMMY_PROJECTS,
    total_omset: totalRevenue,
    target,
    achievement,
    avg_daily: avgDaily,
    daily_chart: dailyChart,
    weekly_chart: weeklyChart,
    client_chart: clientChart,
  };
}
