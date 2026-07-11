'use client';

import { useDashboardStats, useMonthlyData, useDepartmentData, useStatusData, useRecentActivities } from '@/features/dashboard/api';
import { useI18n } from '@/hooks/use-i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, HardHat, Clock, PackageMinus, PackagePlus, AlertTriangle, Truck, Car, CheckSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';

export function DashboardPage() {
  const { t } = useI18n();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyData();
  const { data: deptData, isLoading: deptLoading } = useDepartmentData();
  const { data: statusData, isLoading: statusLoading } = useStatusData();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  const statCards = [
    { key: 'visitorsToday', icon: UserCheck, color: 'text-blue-500' },
    { key: 'contractorsToday', icon: HardHat, color: 'text-orange-500' },
    { key: 'pendingApproval', icon: Clock, color: 'text-yellow-500' },
    { key: 'assetsOut', icon: PackageMinus, color: 'text-purple-500' },
    { key: 'assetsReturned', icon: PackagePlus, color: 'text-green-500' },
    { key: 'expiredRequests', icon: AlertTriangle, color: 'text-red-500' },
    { key: 'shipmentsToday', icon: Truck, color: 'text-teal-500' },
    { key: 'vehicleCheckins', icon: Car, color: 'text-indigo-500' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('nav', 'dashboard')}</h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard', card.key)}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.[card.key as keyof typeof stats] || 0}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Registrations</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {monthlyLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer
                config={{
                  visitor: { label: 'Visitors', color: 'var(--chart-1)' },
                  asset: { label: 'Assets', color: 'var(--chart-2)' },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="visitor" stackId="a" fill="var(--chart-1)" />
                    <Bar dataKey="asset" stackId="a" fill="var(--chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Approval Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer
                config={{}}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard', 'recentActivities')}</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-8">
                {activities?.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <span className="relative flex h-2 w-2 mr-4 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action} - {activity.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.actor} • {format(new Date(activity.timestamp), 'MMM d, p')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard', 'pendingTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center p-8 text-center">
               <div className="rounded-full bg-muted p-3 mb-4">
                 <CheckSquare className="h-6 w-6 text-muted-foreground" />
               </div>
               <p className="text-sm font-medium text-muted-foreground">No pending tasks</p>
               <p className="text-xs text-muted-foreground mt-1">You&apos;re all caught up!</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
