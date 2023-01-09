import { useState, SyntheticEvent } from 'react';
import { Card, Container, Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import GeneralTab from '../sections/user/General';
import PasswordChange from '../sections/user/PasswordChange';

const AccountPage = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getContent = () => {
        switch (value) {
            case 0:
                return <GeneralTab />;
            case 1:
                return <PasswordChange />;
        }
    };

    return (
        <Container
            maxWidth='md'
            sx={{
                height: '100%',
            }}>
            <Typography variant='h4'>Account</Typography>
            <Tabs value={value} onChange={handleChange}>
                <Tab icon={<AccountBoxIcon />} iconPosition='start' label='General' />
                <Tab icon={<KeyIcon />} iconPosition='start' label='Change password' />
            </Tabs>
            <Box mt={4}>{getContent()}</Box>
        </Container>
    );
};

export default AccountPage;
