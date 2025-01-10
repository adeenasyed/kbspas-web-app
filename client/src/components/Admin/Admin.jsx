import SetAvailability from "./SetAvailability";
import DeleteAvailability from "./DeleteAvailability";
import ManagePromos from "./ManagePromos";
import ViewAppts from "./ViewAppts";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import axios from "axios";
import { styled } from "@mui/material";
import theme from "../../theme";

const CustomTypography = styled(Typography)({
    color: theme.palette.formText2
});

const TableHeader = styled(TableCell)({
    fontWeight: 700
});

function Admin() {
    const [availability, setAvailability] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const fetchAvailability = async () => {
        try {
            const response = await axios.get(`/api/fetchAvailability`);
            const data = response.data;
            const dates = data.map(entry => entry.date);
            setAvailability(dates);
        } catch (error) {/* */}
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`/protected/api/fetchAppointments`, { withCredentials: true });
            const data = response.data;
            setAppointments(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (error) {/* */}
    };

    useEffect(() => {
        fetchAvailability();
        fetchAppointments();
    }, []);

    const [value, setValue] = useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
 
    const tabs = [
        { label: "Set Availability", value: 1, component: <SetAvailability CustomTypography={CustomTypography} fetchAvailability={fetchAvailability} datesToDisable={availability}/>},
        { label: "Delete Availability", value: 2, component: <DeleteAvailability CustomTypography={CustomTypography} fetchAvailability={fetchAvailability} availability={availability} appointments={appointments}/>},
        { label: "Manage Promotions", value: 3, component: <ManagePromos CustomTypography={CustomTypography} TableHeader={TableHeader}/> },
        { label: "View Appointments", value: 4, component: <ViewAppts TableHeader={TableHeader} allAppointments={appointments}/> }
    ];

    const renderTab = () => {
        const selectedTab = tabs.find(tab => tab.value === value);
        return selectedTab && selectedTab.component;
    }

    return ( 
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant="scrollable" value={value} onChange={handleChange}>
                    {tabs.map(tab => (<Tab key={tab.value} label={tab.label} value={tab.value} />))}
                </Tabs>
            </Box>
            {renderTab()}
        </>
    );
}

export default Admin;