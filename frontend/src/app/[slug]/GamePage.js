'use client';

import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {Button, TextField} from "@mui/material";

import {socket} from "../../socket";
import {validWord} from '../../utils';

export default function GamePage({params}) {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    const [myMessages, setMyMessages] = useState([]);
    const [friendMessages, setFriendMessages] = useState([]);
    const [message, setMessage] = useState("");

    const roomId = params.slug;

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            socket.emit('join', roomId);
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on('server', (serverMessage) => {
            console.dir(serverMessage)
        })

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    async function sendMessage() {
        const isValidWord = await validWord(message);
        if (!isValidWord) return;

        if (message.length < 4) {
            console.error("Message too small");
            return;
        }

        if (message.split(" ").length > 1) {
            console.error("Message has multiple words");
            return;
        }

        if (friendMessages.length > 1) {
            console.log(message.trim()[0].localeCompare(String(friendMessages[0][friendMessages.length - 1])))
            const compare = message.trim()[0].localeCompare(String(friendMessages[0][friendMessages.length - 1]))
            if (compare < 0) {
                console.error("Message has to start with " + message[0]);
                return;
            }
        }

        setMyMessages([
            ...myMessages, message
        ])
        socket.emit('msg', roomId, message);
    }

    socket.on('message', (message) => {
        setFriendMessages([
            ...friendMessages, message.message,
        ])
    })

    return (
        <Box sx={{flexGrow: 1, maxWidth: 752}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                        You
                    </Typography>

                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                        Friend
                    </Typography>

                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <List dense={false}>
                        {
                            myMessages.map((message) => {
                                return <ListItem>
                                    <ListItemText
                                        primary={message}
                                    />
                                </ListItem>
                            })
                        }
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <List dense={false}>
                        {
                            friendMessages.map((message) => {
                                return <ListItem>
                                    <ListItemText
                                        primary={message}
                                    />
                                </ListItem>
                            })
                        }
                    </List>
                </Grid>
            </Grid>
            <TextField id="standard-basic" label="Message" variant="standard"
                       onChange={(e) => setMessage(e.target.value)}/>
            <Button onClick={() => sendMessage()}>
                Send Message
            </Button>
        </Box>
    );
}
