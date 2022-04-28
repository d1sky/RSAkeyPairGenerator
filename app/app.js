import { Container } from '@mui/material';
import React from 'react';
import TabPanel from './tabs';

export const App = () => {
    return (
        <Container component="main" maxWidth="xs" sx={{ paddingTop: '70px' }}>
            <TabPanel />
        </Container>
    )
}