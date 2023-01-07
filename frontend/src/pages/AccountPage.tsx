import { useState, SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';

const AccountPage = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs value={value} onChange={handleChange}>
                <Tab icon={<AccountBoxIcon />} iconPosition='start' label='General' />
                <Tab icon={<KeyIcon />} iconPosition='start' label='Change password' />
            </Tabs>
            Account Page
        </>
    );
};

export default AccountPage;
