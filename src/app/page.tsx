import { getCustomersPerCity, getInvoiceSize, getRevenueByProduct, getSalesPerMonth, getTopProducts, getTotalRevenue } from '@/app/actions';
import { PieChart } from '@/components/PieChart'
import Navbar from '../components/Navbar'
import styles from './page.module.css'
import { euro } from '@/db/utils';
import { LineChart } from '@/components/LineChart';
import { BarChart } from '@/components/BarChart';

type CustomerPerCity = {
  customerCount: number,
  city: string | null,
}

export default async function Home() {
  const customersPerCity = await getCustomersPerCity();
  const topProducts = await getTopProducts();
  const salesPerMonth = await getSalesPerMonth();
  const nDeals = await getInvoiceSize();
  const totalRevenue = await getTotalRevenue();
  const revenueByProduct = await getRevenueByProduct();

  const labels = customersPerCity.map((cpc: CustomerPerCity) => cpc.city!);
  const data = customersPerCity.map((cpc: CustomerPerCity) => cpc.customerCount);

  const months = [...Array(12).keys()].map(i => (i + 1).toString());
  const salesMap = new Map();

  months.map((month) => {
    salesMap.set(month, 0)
  })

  salesPerMonth.map((sale) => {
    if (salesMap.has(sale.date)) {
      salesMap.set(sale.date, sale.netTotal)
    }
  })

  return (
    <main>
      <Navbar />
      <div className="widget-container">
        <div className={styles.card}>
          <h3>Total Sales Revenue</h3>
          <p>{euro.format(totalRevenue!)}</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.card}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {
                revenueByProduct?.map((revenue, index) => {
                  return (
                    <tr key={index}>
                      <td>{revenue.product}</td>
                      <td>{euro.format(revenue.revenue)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className={styles.card}>
          <h3>Top 3 Sold Products</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>€/Unit</th>
                <th>Qtd</th>
                <th>Invoice Total</th>
              </tr>
            </thead>
            <tbody>
              {
                topProducts.map((topProd, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{topProd.product}</td>
                      <td>{euro.format(Number.parseInt(topProd.unit!))}</td>
                      <td>{topProd.quantity}</td>
                      <td>{euro.format(topProd.invoicetotal)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className={styles.card}>
          <PieChart labels={labels} pieData={data} />
        </div>
        <div className={styles.card}>
          <p>{nDeals}</p>
        </div>
         <div className={styles.card}>
          <BarChart barData={[]} />
        </div>
        <div className={styles.card}>
          <LineChart lineData={Array.from(salesMap.values())} />
        </div>
      </div>
    </main>
  )
}
