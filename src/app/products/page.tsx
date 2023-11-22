import { getProducts } from "../actions";

export default async function Product() {
    const filteredProducts = await getProducts();

    const newProducts = filteredProducts.map((product, index: number) => {
        return (
            <tr key={index}>
                <td>{product.id}</td>
                <td>{product.productGroup}</td>
                <td>{product.description}</td>
            </tr>
        )
    })

    return (
        <main className='invoices'>
            Products
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Group</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {newProducts}
                </tbody>
            </table>
        </main>
    )
}