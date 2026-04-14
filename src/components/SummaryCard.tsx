import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  colorClass: string;
}

export function SummaryCard({ title, value, icon, colorClass }: SummaryCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-heading font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
