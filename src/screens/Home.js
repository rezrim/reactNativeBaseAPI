import React from 'react';
import { Image, View, Modal, TouchableHighlight, Alert} from 'react-native';
import { Container, Header, Title, Form, Item, Label, Input, Textarea, Content, H3, Fab, Footer, FooterTab, H1, Button, Left, Right, Body, Icon, Text, Card, CardItem, Thumbnail, H2 } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import fetchBlob from 'react-native-fetch-blob'
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'

function App(props) {
    const [news, setNews] = React.useState([])
    const [modal, setModal] = React.useState(false)
    const [filePath, setFilePath] = React.useState([])

    const [id, setId] = React.useState(0)
    const [image, setImage] = React.useState('https://via.placeholder.com/150')
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [namaLengkap, setNamaLengkap] = React.useState('')

    React.useEffect(() => {getData()}, []);

    const getData = async () => {
        const user = await AsyncStorage.getItem('User');
        if (user !== null) {
            let data = JSON.parse(user);
            setNamaLengkap(data[0].namaLengkap)
        }

        fetch('https://deploy-node-12.herokuapp.com/api/news')
        .then(res => res.json() )
        .then(data => {
            setNews(data)
            setId(data.length+1)
        })


    }

    const chooseFile = () => {
        var options = {
          title: 'Pilih Gambar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.showImagePicker(options, response => {
     
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else {
            let source = response;
                uploadFile(source)
                .then(res => res.json())
                .then(result => {
                    let dataImage = result.secure_url
                    let subImage = dataImage.substr(46)
                    let folder = 'https://res.cloudinary.com/rezrim/image/upload/c_scale,w_288'+subImage
                    setImage(folder)
                })
            
          }
        });
    };

    const saveNews = () => {
        fetch('https://deploy-node-12.herokuapp.com/api/news', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                id,
                title,
                image,
                description
            })
        }).then(res => res.json())
        .then(data => {
           alert('Data Berhasil di Simpan')
           setId(id+1)
           setImage('https://via.placeholder.com/150')
           setTitle('')
           setDescription('')
           getData()
           
        })
        .catch(err => console.log(err))
    }

    const uploadFile = (file) => {
        return fetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/rezrim/image/upload?upload_preset=krkhtmy2',{
            'Content-Type' : 'multipart/form-data'
        },[
            {name:'file', filename: file.filename, data: 'data:image/jpeg;base64,'+ file.data}
        ])
    }

    return (
        <View style={{flex:1}}>
            <Container>

                <Content>
                    {namaLengkap != "" &&
                        <H2>Selamat Datang {namaLengkap}</H2>
                    }
                    {news.map((val,i) => {
                        return (
                            <Card key={i}>

                                <CardItem cardBody>
                                    <Image source={{uri : val.image}} style={{height: 200, width: null, flex: 1}}/>
                                </CardItem>

                                <CardItem>
                                    <Left>
                                        <H3>{val.title}</H3>
                                    </Left>
                                    <Button onPress={() => props.navigation.navigate('Detail',{idNews:val._id})}>
                                        <Text>READ MORE</Text>
                                    </Button>
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

            <Modal
            animationType="slide"
            transparent={false}
            visible={modal}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
                <ScrollView>
                    <Card>

                        <CardItem>
                            <Left>
                                <H1>Add News</H1>
                            </Left>
                            <TouchableHighlight onPress={() => setModal(!modal) }>
                                <Icon name="close" size={14}/>
                            </TouchableHighlight>
                        </CardItem>
                        
                        <Form>
                            <Item floatingLabel>
                                <Label>Masukkan Judul</Label>
                                <Input onChangeText={(val) => setTitle(val)} />
                            </Item>

                            <CardItem style={{width:500}}>
                                <Textarea style={{width:'70%'}} value={description} onChangeText={(val) => setDescription(val)} rowSpan={5} bordered placeholder="Masukkan Deskripsi" />
                            </CardItem>

                            <CardItem>
                                <Button title="Choose File" onPress={chooseFile}>
                                    <Text>PILIH GAMBAR</Text>
                                </Button>
                            </CardItem>
                            
                            {filePath.data !== "" &&
                                <CardItem>
                                    <Image style={{width: 250, height: 250}}
                                                        
                                        source={{uri: image}}
                                    />
                                </CardItem>
                            }

                            <CardItem>
                                <Button onPress={saveNews}>
                                    <Text>SIMPAN</Text>
                                </Button>
                            </CardItem>
                            
                        </Form>

                    </Card>
                    </ScrollView>
            </Modal>


            <Fab
                direction="up"
                containerStyle={{ }}
                style={{ backgroundColor: '#5067FF' }}
                position="bottomRight"
                onPress={() => setModal(!modal) }>
                        <Icon name="add" />
            </Fab>
        </View>
    );
}

export default App;