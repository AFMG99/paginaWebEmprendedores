import React, { useState } from 'react';
import { FaUserCog, FaShoppingCart, FaChartBar, FaFileAlt, FaUsers, FaUserPlus, FaCashRegister, FaShoppingBasket, FaDollarSign, FaClipboardList, FaShoppingBag } from "react-icons/fa";
import MenuList from '../components/Sidebar/MenuList';
import AdminUsers from './AdminUsers';
import ProfitAnalysis from './ProfitAnalysis';
import Reports from './Reports';
import Sales from './Sales';
import CreateUser from '../components/AdminUsers/CreateUser';
import UserList from '../components/AdminUsers/UserList';
import Purchases from './Purchases';
import RegisterPurchase from '../components/Purchases/RegisterPurchase';
import HomeCarrousel from '../components/Carrousel/HomeCarrousel';
import SalesManager from '../components/Sales/SalesManger';
import CheckSale from '../components/Sales/CheckSale';

const Home = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [reset, setReset] = useState(0);

    const handleItemClick = (item) => {
        if (item.name === "Usuarios" || item.name === "Ventas" || item.name === "Compras" || item.name === "Registrar") {
            setReset(prev => prev + 1);
        }
        setSelectedItem(item);
    };

    const menuItems = [
        {
            name: "Usuarios",
            icon: <FaUserCog />,
            component: <AdminUsers resetView={reset} />,
            subItems: [
                { name: "Consultar", icon: <FaUsers />, component: <UserList /> },
                { name: "Registrar", icon: <FaUserPlus />, component: <CreateUser /> },
            ],
        },
        {
            name: "Ventas",
            icon: <FaShoppingCart />,
            component: <Sales resetView={reset} />,
            subItems: [
                { 
                    name: "Consultar", 
                    icon: <FaClipboardList />,
                    component: <CheckSale key={reset} resetView={reset} /> 
                },
                { 
                    name: "Registrar", 
                    icon: <FaCashRegister />, 
                    component: <SalesManager key={reset} resetView={reset} /> 
                },
            ],
        },
        {
            name: "Compras",
            icon: <FaShoppingBasket />,
            component: <Purchases resetView={reset} />,
            subItems: [
                { name: "Consultar", icon: <FaShoppingBag /> },
                {
                    name: "Registrar",
                    icon: <FaDollarSign />,
                    component: <RegisterPurchase key={reset} resetView={reset} />
                },
            ],
        },
        { name: "Rentabilidad", icon: <FaChartBar />, component: <ProfitAnalysis /> },
        { name: "Informes", icon: <FaFileAlt />, component: <Reports /> },
    ];

    return (
        <div className="home-container">
            <aside className="sidebar col-4">
                <MenuList
                    menuItems={menuItems}
                    onItemClick={handleItemClick}
                    selectedItem={selectedItem}
                />
            </aside>
            <main className="content">
                {selectedItem ? selectedItem.component : <HomeCarrousel />}
            </main>
            <button className="floating-button">
                💬
            </button>
        </div>
    );
};

export default Home;
