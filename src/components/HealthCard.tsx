import { LucideIcon } from 'lucide-react';

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: 'normal' | 'elevated' | 'high';
}

export default function HealthCard({ title, value, unit, icon: Icon, status = 'normal' }: HealthCardProps) {
  const statusColors = {
    normal: 'bg-green-50 border-green-200',
    elevated: 'bg-yellow-50 border-yellow-200',
    high: 'bg-red-50 border-red-200',
  };

  const iconColors = {
    normal: 'text-green-600',
    elevated: 'text-yellow-600',
    high: 'text-red-600',
  };

  return (
    <div className={`${statusColors[status]} border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {unit && <p className="text-lg text-gray-600">{unit}</p>}
          </div>
        </div>
        <div className={`${iconColors[status]} p-3 rounded-lg bg-white bg-opacity-50`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
