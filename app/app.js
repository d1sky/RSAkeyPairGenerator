import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import * as openpgp from 'openpgp';
import React, { useState } from 'react';

export const App = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [privateKey, setPrivateKey] = useState();
    const [publicKey, setPublicKey] = useState();

    const generateKeyPair = () => {
        (async () => {
            const { privateKey, publicKey } = await openpgp.generateKey({
                type: 'rsa', // Type of the key
                rsaBits: 4096, // RSA key size (defaults to 4096 bits)
                userIDs: [{ name, email }], // you can pass multiple user IDs
                passphrase // protects the private key
            });
            setPrivateKey(privateKey)
            setPublicKey(publicKey)

            console.log(privateKey, publicKey);

        })().then(() => {
            const publikKeyElement = document.createElement("a");
            const publikKeyFile = new Blob([publicKey], { type: 'text/plain' });
            publikKeyElement.href = URL.createObjectURL(publikKeyFile);
            publikKeyElement.download = "publik.key";
            publikKeyElement.click();

            const privateKeyElement = document.createElement("a");
            const privateKey = new Blob([privateKey], { type: 'text/plain' });
            privateKeyElement.href = URL.createObjectURL(privateKey);
            privateKeyElement.download = "private.key";
            privateKeyElement.click();
        });
    }


    return (
        <Container component="main" maxWidth="xs" sx={{ paddingTop: '70px' }}>
            <Box mt={2} sx={{
                '& .MuiTextField-root': { paddingBottom: '10px' },
            }}>
                <FormControl fullWidth>
                    <TextField
                        id="fio"
                        label="ФИО"
                        variant="outlined"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth mt='2'>
                    <TextField
                        id="email"
                        label="email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth mt='2'>
                    <TextField
                        id="pass"
                        label="passphrase"
                        variant="outlined"
                        type="password"
                        value={passphrase}
                        onChange={e => setPassphrase(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth mt='2'>
                    <Button loading variant="outlined" disabled={!name && !email && !passphrase} onClick={generateKeyPair} >
                        Сгенерировать ключи
                    </Button>
                </FormControl>
            </Box>

        </Container>
    )
}