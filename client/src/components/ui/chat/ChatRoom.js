import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormLabel,
    Box,
    Textarea,
    Button,
    Input,
    Stack, useDisclosure, Radio, RadioGroup,
} from '@chakra-ui/react'
import React, {useEffect} from "react";

function ChatRoom({webrtcSocket}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = React.useState('right')
    const nameField = React.useRef()
    const messageField = React.useRef()

    const [chatMsg, setChatMsg] = React.useState()

    useEffect(() => {
        webrtcSocket.on('chat', ({msg}) => {
            console.log('chat data:', msg);
            // setChatMsg(<p>{data.msg}</p>)
            const item = document.createElement('li');
            item.textContent = msg;
            console.log(item)
            document.getElementById('messages').appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    }, [])


    function sendMsg() {
        console.log('click sendMsg');
        let name = nameField.current.value;
        let sendMsg = messageField.current.value;
        let msg = `${name}: ${sendMsg}`;
        console.log(msg);
        webrtcSocket.emit('chat', {msg})
    }

    return (
        <>
            <RadioGroup defaultValue={placement} onChange={setPlacement}>
                <Stack direction='row' mb='4'>
                    <Radio value='top'>Top</Radio>
                    <Radio value='right'>Right</Radio>
                    <Radio value='bottom'>Bottom</Radio>
                    <Radio value='left'>Left</Radio>
                </Stack>
            </RadioGroup>
            <Button colorScheme='blue' onClick={onOpen}>
                Enter Chat Room
            </Button>
            <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
                    <Box>
                        <FormLabel htmlFor='username'>Name</FormLabel>
                        <Input
                            ref={nameField}
                            id='username'
                            placeholder='Please enter user name'
                        />
                        <FormLabel htmlFor='message'>Message</FormLabel>
                        <Textarea
                            ref={messageField}
                            id='message'
                            placeholder='Please enter message'
                        />
                        <Button colorScheme='blue' onClick={sendMsg}>Send Message</Button>
                    </Box>
                    <DrawerBody>
                        <p id={'messages'}></p>
                        {/*<p>Some contents...</p>*/}
                        {/*<p>Some contents...</p>*/}
                        {/*<p>Some contents...</p>*/}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default ChatRoom;
