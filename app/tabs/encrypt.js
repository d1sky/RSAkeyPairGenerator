import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import * as openpgp from 'openpgp';
import React, { useState } from 'react';
import { FormLabel } from '@mui/material';

const Input = styled('input')({
    display: 'none',
});

export default function Encrypt({ keyStore }) {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('encryptedFile');
    const [isSwitch, setIsSwitch] = useState(false);
    const [text, setText] = useState('Зашифруй меня полностью!');
    const [encrypted, setEncrypted] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [privateKeyFile, setPrivateKeyFile] = useState();
    const [publicKeyFile, setPublicKeyFile] = useState();

    // this.setState({ selectedFile: event.target.files[0] }); 

    const onFileChange = e => {
        console.log('onFileChange', e.target.files[0]);
        setFileName(e.target.files[0].name)
        // setFile(e.target.files[0])

        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = reader.result;
            setFile(content)

        }

        reader.readAsText(file);
    }

    const onPublicKeyChange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = reader.result;
            setPublicKeyFile(content)
        }

        reader.readAsText(file);
    }

    const signFile = () => {
        (async () => {
            console.log('privateKeyFile', privateKeyFile);

            const publicKeyArmored = publicKeyFile
            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: isSwitch ? file : text }), // input as Message object
                encryptionKeys: publicKey,
            });

            console.log('encrypted', encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

            setEncrypted(encrypted)
            try {
                // await signatures[0].verified; // throws on invalid signature
                // console.log('Signature is valid');
            } catch (e) {
                throw new Error('Signature could not be verified: ' + e.message);
            }
        })();
    }

    const saveFile = () => {
        const url = window.URL.createObjectURL(new Blob([encrypted]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '^' + fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
    }

    return (
        <>
            <FormLabel fullWidth mt='2' htmlFor="contained-button-file" sx={{ paddingBottom: '10px' }}>
                {/* <FormControl fullWidth mt='2' htmlFor="contained-button-file" sx={{ paddingBottom: '10px' }}> */}
                    <Input accept="*" id="contained-button-file" multiple type="file" onChange={onPublicKeyChange} />
                    <Button variant="outlined" component="span">
                        Публичный ключ
                    </Button>
                {/* </FormControl> */}
            </FormLabel>
            <FormGroup>
                <FormControlLabel control={<Switch checked={isSwitch} />} label="File" onChange={() => setIsSwitch(!isSwitch)} />
            </FormGroup>
            {isSwitch ?
                <label htmlFor="file-to-encrypt">
                    <FormControl fullWidth mt='2' htmlFor="file-to-encrypt">
                        <Input accept="*" id="file-to-encrypt" multiple type="file" onChange={onFileChange} />
                        <Button variant="outlined" component="span">
                            Файл для шифрования
                        </Button>
                    </FormControl>
                </label>
                :
                <FormControl fullWidth mt={2} sx={{ paddingBottom: '10px' }}>
                    <TextField
                        id="text"
                        label="Текст для шифровки"
                        variant="outlined"
                        multiline
                        maxRows={4}
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </FormControl>
            }
            <Box
                mt={2}
                sx={{ paddingBottom: '10px' }}
            >
                <FormControl fullWidth mt='2'>
                    <Button loading variant="outlined" disabled={!publicKeyFile} onClick={signFile} >
                        Шифровать
                    </Button>
                </FormControl>


            </Box>
            {encrypted &&
                <>
                    <FormControl fullWidth mt='2' sx={{ paddingBottom: '10px' }}>
                        <Button loading variant="outlined" onClick={saveFile} >
                            Сохранить зашифрованный файл
                        </Button>
                    </FormControl>
                    <TextField fullWidth mt='2' sx={{ paddingBottom: '10px' }}
                        id="outlined-read-only-input"
                        label="Зашифрованный текст"
                        multiline
                        value={encrypted}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </>
            }
        </>
    )
}