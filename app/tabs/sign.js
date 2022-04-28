import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import * as openpgp from 'openpgp';
import React, { useState } from 'react';

const Input = styled('input')({
    display: 'none',
});

export default function Sign({ keyStore }) {
    const [file, setFile] = useState();
    const [email, setEmail] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [privateKey, setPrivateKey] = useState();
    const [publicKey, setPublicKey] = useState();

    // this.setState({ selectedFile: event.target.files[0] }); 

    const onFileChange = e => {
        setFile(e.target.files[0])

    }

    const signFile = () => {
        (async () => {
            console.log('signFile', keyStore);
            // put keys in backtick (``) to avoid errors caused by spaces or tabs
            const publicKeyArmored = keyStore?.public
            const privateKeyArmored = keyStore?.private; // encrypted private key
            const passphrase = keyStore?.passphrase; // what the private key is encrypted with

            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                passphrase
            });

            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: 'Hello, World!' }), // input as Message object
                encryptionKeys: publicKey,
                signingKeys: privateKey // optional
            });
            console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

            const message = await openpgp.readMessage({
                armoredMessage: encrypted // parse armored message
            });

            const { data: decrypted, signatures } = await openpgp.decrypt({
                message,
                verificationKeys: publicKey, // optional
                decryptionKeys: privateKey
            });

            console.log(decrypted); // 'Hello, World!'
            // check signature validity (signed messages only)

            try {
                await signatures[0].verified; // throws on invalid signature
                console.log('Signature is valid');
            } catch (e) {
                throw new Error('Signature could not be verified: ' + e.message);
            }
        })();
    }

    return (
        <>

            <label htmlFor="contained-button-file">
                <FormControl fullWidth mt='2' htmlFor="contained-button-file">
                    <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
                    <Button variant="outlined" component="span">
                        Что подписываем?
                    </Button>
                </FormControl>
            </label>
            <Box
                mt={2}
                sx={{ paddingBottom: '10px' }}
            >
                <FormControl fullWidth mt='2'>
                    <Button loading variant="outlined" disabled={!keyStore.public && !keyStore.private && !keyStore.passphrase} onClick={signFile} >
                        Шифровать
                    </Button>
                </FormControl>
            </Box>
        </>
    )
}