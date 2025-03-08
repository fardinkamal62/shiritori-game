'use client';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Button, TextField} from "@mui/material";
import Link from 'next/link'

import {socket} from "../socket";
import {useState} from "react";

export default function Home() {
    const [roomName, setRoomName] = useState("");

    function sendMessage() {
        console.log(socket.id);
        socket.emit('msg', 'Hello from Next');
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex justify-center items-center w-full mt-4">
                <section className="bg-white p-4 rounded flex flex-col items-center">
                    <Typography variant="h4" component="h2" className="col-span-4">Shiritori Game</Typography>
                    <TextField id="standard-basic" label="Room Name" variant="standard" onChange={(value) => setRoomName(value.target.value)}/>
                    <br className="col-span-4"/>
                    <Button variant='contained'>
                        <Link href={`/${roomName === '' ? socket.id : roomName}`}>Join {roomName === '' ? 'Random Room' : "Room: " + roomName}</Link>
                    </Button>
                </section>
            </div>
        </div>
    );
}
