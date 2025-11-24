import { ReactNode } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  onBack?: () => void;
  children?: ReactNode;
}

export const PageHeader = ({
  title,
  description,
  icon,
  action,
  onBack,
  children,
}: PageHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200/50 shadow-lg mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {onBack && (
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="border-sky-200 text-sky-600 hover:bg-sky-50 rounded-xl shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          {icon && (
            <div
              className="p-3 rounded-xl shadow-md"
              style={{
                background: "linear-gradient(135deg, #5B9BD5 0%, #4A8CC7 100%)",
              }}
            >
              <div className="text-white">{icon}</div>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-sky-900">{title}</h1>
            {description && <p className="text-sky-600 mt-1">{description}</p>}
            {children}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};
