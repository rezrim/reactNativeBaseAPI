import React from 'react';
import { Container, Header, Title, Content, H3, Fab, Form, Textarea, Input, Footer, FooterTab, H1, Button, Left, Right, Body, Icon, Text, Card, CardItem, Thumbnail, Item, } from 'native-base';
import {View, TouchableHighlight} from 'react-native'

function Register(props) {
    const [id,setId] = React.useState('')
    const [namaLengkap,setNamaLengkap] = React.useState('')
    const [email,setEmail] = React.useState('')
    const [username,setUsername] = React.useState('')
    const [password,setPassword] = React.useState('')

    React.useEffect(() => {getData()}, []);

    const saveRegister = () => {
        fetch('http://deploy-node-12.herokuapp.com/api/user/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                id,
                namaLengkap,
                email,
                username,
                password
            })
        }).then(res => res.json())
        .then(data => {
            alert('Register Berhasil !')
            console.log(data)
            getData()
        })
            .catch(err => console.log(err))
    }

    const getData = () => {
        fetch('https://deploy-node-12.herokuapp.com/api/user')
        .then(res => res.json() )
        .then(data => {
            setId(data.length+1)
        })
    }

    return (
       <Container style={{flex:1, justifyContent:'center'}}>

        <H1 style={{textAlign:'center'}}>Register</H1>
           <Form>
                <Item>
                    <Icon active name='person' />
                    <Input placeholder="Nama Lengkap" onChangeText={(val) => setNamaLengkap(val)}/>
                </Item>
                <Item>
                    <Icon active type="MaterialIcons" name='email' />
                    <Input placeholder="Email" autoCapitalize="none"  onChangeText={(val) => setEmail(val)}/>
                </Item>
                <Item>
                    <Icon active name='home' />
                    <Input placeholder="Username" autoCapitalize="none" keyboardType="email-address" onChangeText={(val) => setUsername(val)}/>
                </Item>
                <Item>
                    <Icon active name='lock' />
                    <Input placeholder="Password" autoCapitalize="none" secureTextEntry={true}  onChangeText={(val) => setPassword(val)}/>
                </Item>

                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Button style={{marginVertical:10}} onPress={saveRegister}>
                        <Text>Sign Up</Text>
                    </Button>
                </View>
           </Form>
       </Container>
    );
}

export default Register;