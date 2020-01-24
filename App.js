import React from "react";
import {Image, View } from 'react-native'
import { Container, Header, Title, ListItem, Content, H3, Footer, FooterTab, H1, Button, Left, Right, Body, Icon, Text, Card, CardItem, Thumbnail } from 'native-base';

import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "./src/screens/Home";
import DetailScreen from "./src/screens/Detail";
import LoginScreen from './src/screens/Login'
import RegisterScreen from './src/screens/Register'


const stackOption = (props) => {
  return {
    headerStyle: {
      backgroundColor: 'blue',
    },
    headerLeft: (
      (props.navigation.state.routeName !== "Home" &&
      <Button transparent onPress={() => props.navigation.goBack()}>
        <Icon name="arrow-back" style={{color:'#fff', fontSize:40}}/>
      </Button>
      )
    ),
    headerTitle: (
      <Body>
        <Title>Blog Kami</Title>
      </Body>
    ),
    headerRight: (
      (props.navigation.state.routeName === "Home" &&
        <Button transparent onPress={props.navigation.toggleDrawer}>
          <Icon name='menu' style={{color:'#fff', fontSize:40}}/>
        </Button>
      )
    ),
  }
}

const SideBar = (props) => {
  return (
    <Container>
      <Content>

        <Image 
          source={require('./src/images/paket-internet-marketing.webp')}
        />

        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: "#007AFF" }} onPress={() => props.navigation.navigate('Home')}>
              <Icon active name="home" />
            </Button>
          </Left>
          <Body>
            <Text>Home</Text>
          </Body>
        </ListItem>

        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: "#007AFF" }} onPress={() => props.navigation.navigate('Login')}>
              <Icon active type="MaterialIcons" name="phonelink-lock" />
            </Button>
          </Left>
          <Body>
            <Text>Login</Text>
          </Body>
        </ListItem>

      </Content>
    </Container>
  );
}

const drawerNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

const stackNavigator = createStackNavigator(
  {
    Home : { screen: drawerNavigator, navigationOptions:stackOption },
    Detail: { screen: DetailScreen, navigationOptions:stackOption },
    Register: { screen: RegisterScreen, navigationOptions:stackOption }
  }
)

export default createAppContainer(stackNavigator);
