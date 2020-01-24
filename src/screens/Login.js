import React from 'react';
import { Container, Header, Title, Content, H3, Fab, Form, Textarea, Input, Footer, FooterTab, H1, Button, Left, Right, Body, Icon, Text, Card, CardItem, Thumbnail, Item, } from 'native-base';
import {View, TouchableHighlight} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

function Login(props) {
    const [username,setUsername] = React.useState('')
    const [password,setPassword] = React.useState('')

    const login = () => {
        fetch('http://deploy-node-12.herokuapp.com/api/user/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => res.json())
        .then(async data => {
            await AsyncStorage.setItem('User', JSON.stringify(data));
            alert('Login Berhasil !')
            props.navigation.navigate('Home')
        })
        .catch(err => console.log(err))
    }

    return (
       <Container style={{flex:1, justifyContent:'center'}}>

        <H1 style={{textAlign:'center'}}>LOGIN</H1>
           <Form>
                <Item>
                    <Icon active name='home' />
                    <Input placeholder="Username" autoCapitalize="none" onChangeText={(val)=> setUsername(val)}/>
                </Item>
                <Item last>
                    <Icon active name='lock' />
                    <Input placeholder="Password" autoCapitalize="none" onChangeText={(val)=> setPassword(val)} secureTextEntry={true}/>
                </Item>

                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <TouchableHighlight onPress={()=> props.navigation.navigate('Register')}>
                        <Text note style={{marginVertical:10}}>Don't Have an Account ? Sign Up</Text>
                    </TouchableHighlight>

                    <Button style={{marginVertical:10}} onPress={login}>
                        <Text>Sign In</Text>
                    </Button>
                </View>
           </Form>
       </Container>
    );
}

export default Login;