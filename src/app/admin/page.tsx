import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatCurrency } from "@/lib/formatters";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { totalPriceInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.totalPriceInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { totalPriceInCents: true },
    }),
  ]);
  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.totalPriceInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

async function getCategoryData(){
  const [activeCount,inactiveCount] = await Promise.all([
    db.category.count({ where: { isActive : true }}),
    db.category.count({ where: { isActive : false }}),
  ])

  return {
    activeCount,
    inactiveCount
  }
}

export default async function AdminDashboard() {
  const [salesData, userData, productData, categoryData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
    getCategoryData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatNumber(userData.averageValuePerUser)} Average Value`}
        body={formatCurrency(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
       <DashboardCard
        title="Active Categorys"
        subtitle={`${formatNumber(categoryData.inactiveCount)} Inactive`}
        body={formatNumber(categoryData.activeCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
