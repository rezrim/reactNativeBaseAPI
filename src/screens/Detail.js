import React from 'react';
import { Image, View, Alert } from 'react-native';
import { Container, Header, Title, Content, H3, Fab, Form, Textarea, Input, Footer, FooterTab, H1, Button, Left, Right, Body, Icon, Text, Card, CardItem, Thumbnail, } from 'native-base';
import moment from "moment-timezone";
import AsyncStorage from '@react-native-community/async-storage'

function Detail(props) {
    const [news,setNews] = React.useState([])
    const [comment,setComment] = React.useState([])

    const [commentId, setCommentId] = React.useState(0)
    const [user, setUser] = React.useState('')
    const [inputComment, setInputComment] = React.useState('')

    const [edit, setEdit] = React.useState(false)
    const [inputEdit, setInputEdit] = React.useState('')

    const newsId = props.navigation.state.params.idNews

    React.useEffect(() => {getData()}, []);

    const getData = async () => {
        const user = await AsyncStorage.getItem('User');
        if (user !== null) {
            let data = JSON.parse(user);
            setUser(data[0].namaLengkap)
        }

        fetch('https://deploy-node-12.herokuapp.com/api/news/'+newsId)
        .then(res=> res.json())
        .then(data => {
            setNews(data)
        })

        fetch('https://deploy-node-12.herokuapp.com/api/comment/'+newsId)
        .then(res=> res.json())
        .then(data => {
            setCommentId(data.length+1)
            setComment(data)
        })
    }

    const deleteKomenSubmit = (id) => {
        Alert.alert(
            'Hapus Komentar',
            'Yakin Menghapus Komentar ini ?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'OK', onPress: () => deleteKomen(id)},
            ],
          );
    }

    const deleteKomen = (id) => {
        console.log(id)
        fetch('https://deploy-node-12.herokuapp.com/api/comment/'+id, {
            method: 'DELETE',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                id,
            })
        }).then(res => res.json())
        .then(data => {
            alert('Data Berhasil di Hapus')
            console.log(data)
            getData()
        })
            .catch(err => console.log(err)) 
    }

    const saveKomen = () => {
        fetch('https://deploy-node-12.herokuapp.com/api/comment/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                id:commentId,
                newsId,
                user,
                comment:inputComment
            })
        }).then(res => res.json())
        .then(data => {
            alert('Data Berhasil di Simpan')
            console.log(data)
            getData()
        })
            .catch(err => console.log(err))
    }

    const updateKomen = (id) => {
        fetch('https://deploy-node-12.herokuapp.com/api/comment/'+id, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                comment:inputEdit
            })
        }).then(res => res.text())
        .then(data => {
            alert('Data Berhasil di Update')
            console.log(data)
            getData()
            setEdit(false)
        })
            .catch(err => console.log(err)) 
    }

    return (
        <Container>

            <Content>

                <Card>

                    <CardItem>
                        <H1 style={{textAlign:'center'}}>{news.title}</H1>
                    </CardItem>

                    <CardItem>
                        <Text note style={{textAlign:'center', width:'100%'}}>{moment(news.createdAt).tz("Asia/Jakarta").format("DD MMMM YYYY")}</Text>
                    </CardItem>

                    <CardItem cardBody>
                        <Image source={{uri:news.image}} style={{height: 200, width: null, flex: 1}}/>
                    </CardItem>

                    <CardItem>
                        <Text style={{textAlign:'justify'}}>
                            {news.description}
                        </Text>
                    </CardItem>
                    
                </Card>

                {user != "" &&

                <Card>

                    <CardItem>
                        <H1>Komentar</H1>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Thumbnail source={require('../images/paket-internet-marketing.webp')} />
                            <Body>
                                <Text>{user}</Text>
                            </Body>
                        </Left>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Form style={{width:'100%'}}>
                                <Textarea rowSpan={5} bordered placeholder="Masukkan Komentar" onChangeText={(val)=>setInputComment(val)}/>
                            </Form>
                        </Left>
                    </CardItem>

                    <CardItem style={{alignSelf:'flex-end'}}>
                            <Button iconLeft onPress={saveKomen}>
                                <Icon name='send' />
                                <Text>Send</Text>
                            </Button>
                    </CardItem>

                </Card>
                
                }

                {comment.map((val,i) => {
                    return (
                        <Card key={i}>

                            <CardItem>
                                <Left>
                                    <Thumbnail source={require('../images/paket-internet-marketing.webp')} />
                                    <Body>
                                        <Text>{val.user}</Text>
                                    </Body>
                                </Left>
                            </CardItem>

                            <CardItem> 
                                {!edit ? (
                                <Text style={{textAlign:'justify'}}>
                                    {val.comment}
                                </Text>
                                ):(
                                <Form style={{width:'80%'}}>
                                    <Textarea rowSpan={5} bordered placeholder="Masukkan Komentar" value={inputEdit} onChangeText={(val)=>setInputEdit(val)}/>
                                </Form>
                                )}
                                <Right>
                                    <Button iconLeft transparent onPress={() => {
                                                                            setEdit(!edit)
                                                                            setInputEdit(val.comment)
                                                                        }}>
                                        <Icon type="MaterialIcons" style={{fontSize:30, color:'green'}} name='edit' />
                                    </Button>
                                    {!edit ? (
                                        <Button iconLeft transparent onPress={()=>deleteKomenSubmit(val._id)}>
                                            <Icon type="MaterialIcons" style={{fontSize:30, color:'red'}} name='delete' />
                                        </Button>
                                    ):(
                                        <Button iconLeft transparent onPress={()=>updateKomen(val._id)}>
                                            <Icon type="MaterialIcons" style={{fontSize:30, color:'blue'}} name='save' />
                                        </Button>
                                    )}
                                </Right>
                            </CardItem>

                        </Card>
                    )
                })}

            </Content>

            <Footer>

                <FooterTab>
                    <Button full>
                        <Text>Footer</Text>
                    </Button>
                </FooterTab>

            </Footer>

        </Container>
    );
}

export default Detail;