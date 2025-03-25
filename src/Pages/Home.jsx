import React, { useState } from 'react';
import { FaUserCog, FaShoppingCart, FaChartBar, FaFileAlt, FaUsers, FaUserPlus, FaCashRegister, FaShoppingBasket, FaDollarSign } from "react-icons/fa";
import MenuList from '../components/Sidebar/MenuList';
import AdminUsers from './AdminUsers';
import ProfitAnalysis from './ProfitAnalysis';
import Reports from './Reports';
import Sales from './Sales';
import CreateUser from '../components/AdminUsers/CreateUser';
import UserList from '../components/AdminUsers/UserList';

const Home = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [resetAdminUsers, setResetAdminUsers] = useState(false);

    const handleItemClick = (item) => {
        if (item.name === "Usuarios") {
            setResetAdminUsers((prev) => !prev);
        }
        setSelectedItem(item);
    };

    const menuItems = [
        {
            name: "Usuarios",
            icon: <FaUserCog />,
            component: <AdminUsers resetView={resetAdminUsers} />,
            subItems: [
                { name: "Consultar", icon: <FaUsers />, component: <UserList /> },
                { name: "Registrar", icon: <FaUserPlus />, component: <CreateUser /> },
            ],
        },
        { 
            name: "Ventas", 
            icon: <FaShoppingCart />, 
            component: <Sales />,
            subItems: [
                {name: "Registrar", icon: <FaCashRegister />},
            ],
        },
        { 
            name: "Compras", 
            icon: <FaShoppingBasket />, 
            component: <Sales />,
            subItems: [
                {name: "Registrar", icon: <FaDollarSign />},
            ],
        },
        { name: "Rentabilidad", icon: <FaChartBar />, component: <ProfitAnalysis /> },
        { name: "Informes", icon: <FaFileAlt />, component: <Reports /> },
    ];

    return (
        <div className="home-container">
            <aside className="sidebar">
                <MenuList 
                    menuItems={menuItems} 
                    onItemClick={handleItemClick} 
                    selectedItem={selectedItem} 
                />
            </aside>
            <main className="content">
                {selectedItem ? selectedItem.component : <h2>Seleccione una opción</h2>}
            </main>
        </div>
    );
};

export default Home;
