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

const Input = styled('input')({
    display: 'none',
});

export default function Decrypt({ keyStore }) {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('encryptedFile');
    const [isSwitch, setIsSwitch] = useState(false);
    const [text, setText] = useState('');
    const [encrypted, setEncrypted] = useState('');
    const [decrypted, setDecrypted] = useState('');
    const [signatures, setSignatures] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [privateKeyFile, setPrivateKeyFile] = useState();
    const [publicKeyFile, setPublicKeyFile] = useState();

    const onFileChange = e => {
        console.log('onFileChange', e.target.files[0]);
        setFileName(e.target.files[0].name)

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
            //Here the content has been read successfuly
            setPrivateKeyFile(content)
            // alert(content);
        }

        reader.readAsText(file);
    }

    const signFile = () => {
        (async () => {
            const privateKeyArmored = privateKeyFile // encrypted private key
            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                passphrase
            });

            const message = await openpgp.readMessage({
                armoredMessage: isSwitch ? file : text // parse armored message
            });

            const { data: decrypted, signatures } = await openpgp.decrypt({
                message,
                decryptionKeys: privateKey
            });

            setDecrypted(decrypted)
            setSignatures(signatures)

            console.log('signatures', signatures);
            try {
                // await signatures[0].verified; // throws on invalid signature
                // console.log('Signature is valid');
            } catch (e) {
                throw new Error('Signature could not be verified: ' + e.message);
            }
        })();
    }

    return (
        <>
            <label htmlFor="contained-button-file">
                <FormControl fullWidth mt='2' htmlFor="contained-button-file" sx={{ paddingBottom: '10px' }}>
                    <Input accept="*" id="contained-button-file" multiple type="file" onChange={onPublicKeyChange} />
                    <Button variant="outlined" component="span">
                        Приватный ключ
                    </Button>
                </FormControl>
            </label>
            <FormControl fullWidth mt='2' sx={{ paddingBottom: '10px' }}>
                <TextField
                    id="pass"
                    label="passphrase"
                    variant="outlined"
                    type="password"
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                />
            </FormControl>
            <FormGroup>
                <FormControlLabel control={<Switch checked={isSwitch} />} label="File" onChange={() => setIsSwitch(!isSwitch)} />
            </FormGroup>
            {decrypted &&
                <>
                    <TextField fullWidth mt='2' sx={{ paddingBottom: '10px' }}
                        id="outlined-read-only-input"
                        label="Подпись"
                        multiline
                        value={signatures}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField fullWidth mt='2' sx={{ paddingBottom: '10px' }}
                        id="outlined-read-only-input"
                        label="Расшифрованный текст"
                        multiline
                        value={decrypted}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </>
            }
            <FormControl fullWidth mt='2'>
                <Button loading variant="outlined" disabled={!privateKeyFile && !passphrase} onClick={signFile} >
                    Расшифровать
                </Button>
            </FormControl>
            {isSwitch ?
                <label htmlFor="encrypted-file">
                    <FormControl fullWidth mt='2' htmlFor="encrypted-file" sx={{ paddingTop: '10px' }}>
                        <Input accept="*" id="encrypted-file" multiple type="file" onChange={onFileChange} />
                        <Button variant="outlined" component="span">
                            Зашифрованный файл
                        </Button>
                    </FormControl>
                </label>
                :
                <FormControl fullWidth mt={2} sx={{ paddingTop: '10px' }}>
                    <TextField
                        id="text"
                        label="Зашифрованный текст"
                        variant="outlined"
                        multiline
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </FormControl>
            }
            <Box
                mt={2}
                sx={{ paddingBottom: '10px' }}
            >



            </Box>

        </>
    )
}