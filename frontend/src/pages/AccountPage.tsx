import { useState, SyntheticEvent } from 'react';
import { Container, Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import GeneralTab from '../sections/user/General';
import PasswordChange from '../sections/user/PasswordChange';
import { Helmet } from 'react-helmet-async';

const AccountPage = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
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
        <>
            <Helmet title='Account | Hovee' />
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
        </>
    );
};

export default AccountPage;
