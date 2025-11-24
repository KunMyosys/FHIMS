import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  TrendingUp,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: string;
}) => (
  <Card className="border-sky-200/50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm text-sky-900">{title}</CardTitle>
      <div className="text-sky-500">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-sky-900">{value}</div>
      <p className="text-xs text-sky-600 mt-1">{description}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200/50 shadow-lg">
        <h1 className="text-sky-900">Welcome back, {user?.name}!</h1>
        <p className="text-sky-600 mt-1">
          Here's what's happening with your operations today.
        </p>
      </div>
    </div>
  );
};
