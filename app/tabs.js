import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Generator from './tabs/generator'
import Sign from './tabs/sign'
import Encrypt from './tabs/encrypt'
import Decrypt from './tabs/decrypt'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [keyStore, setKeyStore] = React.useState({ private: '', public: '', passphrase: '' })

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            component="div"
            sx={{ width: '100%' }}
        >
            <Box component="form" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Генерация" {...a11yProps(0)} />
                    <Tab label="Шифрование" {...a11yProps(1)} />
                    <Tab label="Расшифровка" {...a11yProps(2)} />
                    {/* <Tab label="Подписание" {...a11yProps(1)} /> */}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Generator setKeyStore={setKeyStore} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Encrypt keyStore={keyStore} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Decrypt keyStore={keyStore} />
            </TabPanel>
            {/* <TabPanel value={value} index={1}>
                <Sign keyStore={keyStore} />
            </TabPanel> */}
        </Box>
    );
}
