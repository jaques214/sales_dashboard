import { getCustomersPerCity } from '@/app/actions';
import { Chart } from '@/components/Chart'
import Navbar from '../components/Navbar'
import styles from './page.module.css'

type CustomerPerCity = {
  customerCount: number,
  city: string | null,
}

export default async function Home() {
  const customersPerCity = await getCustomersPerCity();

  const labels = customersPerCity.map((cpc: CustomerPerCity) => cpc.city!);
  const data = customersPerCity.map((cpc: CustomerPerCity) => cpc.customerCount);

  return (
    <main>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <Chart labels={labels} pieData={data} />
        </div>
      </div>
    </main>
  )
}
