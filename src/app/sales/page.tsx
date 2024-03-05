import React from 'react'
import styles from './page.module.css'
import { getInvoices } from '../actions';
import { euro } from '@/db/utils';

export default async function Invoice() {
  const filteredInvoices = await getInvoices();

  const newInvoices = filteredInvoices.map((invoice, index: number) => {
    const dateFormat = new Date(invoice.date!).toLocaleDateString('pt-PT');
    const formattedID = invoice.id.split('.');
    const id = formattedID[0] + " Nº " + formattedID[1].substring(1, formattedID[1].length) + "/A"
    return (
      <tr key={index}>
        <td>{id}</td>
        <td>{dateFormat}</td>
        <td>{euro.format(Number.parseInt(invoice.taxPayable!))}</td>
        <td>{euro.format(Number.parseInt(invoice.netTotal!))}</td>
        <td>{euro.format(Number.parseInt(invoice.grossTotal!))}</td>
        <td>{invoice.name}</td>
        <td></td>
      </tr>
    )
  })


  return (
    <main className='invoices'>
      Invoice
      <table className={styles.invoiceTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Tax Payable (€)</th>
            <th>Net Total (€)</th>
            <th>Gross Total (€)</th>
            <th>Customer Name</th>
            <th>View More</th>
          </tr>
        </thead>
        <tbody>
          {newInvoices}
        </tbody>
      </table>
    </main >
  )
}
