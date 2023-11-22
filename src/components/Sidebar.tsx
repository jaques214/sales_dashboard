'use client';
import { usePathname } from 'next/navigation'
import './sidebar.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from 'next/link';
import { ReactElement } from 'react';

type NavBar = {
    id: number,
    title: string,
    icon: ReactElement,
    url: string
}

const links: NavBar[] = [
    {
        id: 1,
        title: "Dashboard",
        icon: <DashboardIcon className='dashboard-icon' sx={{ width: '40px', height: '40px', padding: '5px', color: '#6C7293' }} />,
        url: "/"
    },
    {
        id: 2,
        title: "Sales",
        icon: <PointOfSaleIcon className='dashboard-icon' sx={{ width: '40px', height: '40px', padding: '5px', color: '#6C7293' }} />,
        url: "/sales"
    },
    {
        id: 3,
        title: "Purchases",
        icon: <ShoppingCartIcon className='dashboard-icon' sx={{ width: '40px', height: '40px', padding: '5px', color: '#6C7293' }} />,
        url: "/purchases"
    },
    {
        id: 4,
        title: "Customers",
        icon: <GroupsIcon className='dashboard-icon' sx={{ width: '40px', height: '40px', padding: '5px', color: '#6C7293' }} />,
        url: "/customers"
    },
    {
        id: 5,
        title: "Suppliers",
        icon: <HandshakeIcon className='dashboard-icon' sx={{ width: '40px', height: '40px', padding: '5px', color: '#6C7293' }} />,
        url: "/suppliers"
    },
    {
        id: 6,
        title: "Products",
        icon: <InventoryIcon className='dashboard-icon' sx={{ width: '40px', height: '40px', padding: '5px', color: '#6C7293' }} />,
        url: "/products"
    }
]

export default function Sidebar() {
    const pathname = usePathname()

    const navLinks = links.map((link: NavBar) => {
        return (
            <Link key={link.id} className={pathname == link.url ? 'nav-item active' : 'nav-item'} href={link.url}>
                {/* <DashboardRoundedIcon className='dashboard-icon' sx={{width: '40px', height: '40px', padding: '5px', color: '#6C7293'}}/> */}
                {link.icon}
                {link.title}
            </Link>
        )
    })

    return (
        <aside className='sidebar'>
            <div className='logo'>
                <LocalShippingIcon className="truck-icon"></LocalShippingIcon>
                <p>Engenheiros das Peles, LDA.</p>
            </div>
            {navLinks}
        </aside>
    )
}