import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  BackHandler,
  Image,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Paragraph,
  Title,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  addRental,
  getAllRental,
  getToken,
  getUserRental,
} from '../redux/action';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DocumentPicker from 'react-native-document-picker';
export default function RentalList({navigation}) {
  let rentalList = useSelector(state => state.rentalReducer.rentalList);
  let allRental = useSelector(state => state.rentalReducer.allRental);

  let loading = useSelector(state => state.rentalReducer.loading);
  let token = useSelector(state => state.rentalReducer.token);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserRental());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllRental());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getToken());
  }, [dispatch]);
  // useEffect(() => {
  //   async function preventBackPress() {
  //     let isLogin = await AsyncStorage.getItem('USER_LOGIN');
  //     if (!isLogin) {
  //       navigation.push('Login');
  //     }
  //     if (isLogin) {
  //       const backHandler = BackHandler.addEventListener(
  //         'hardwareBackPress',
  //         () => {
  //           navigation.push('TabHome');
  //         },
  //       );
  //       return () => backHandler.remove();
  //     }
  //   }
  //   preventBackPress();
  // }, []);
  let [showAdd, setShowAdd] = useState(false);
  let [showConfirm, setShowConfirm] = useState(false);
  let [rentalInfo, setRentalInfo] = useState({
    propertyName: '',
    property: '',
    room: '',
    rent: '',
    reporter: '',
  });
  let [image, setImage] = useState(null);
  let [errorImage, setError] = useState({
    image: '',
  });
  let initialeImage = {
    image: '',
  };
  if (loading) {
    return <ActivityIndicator style={style.loadingDiv} animating={true} />;
  }

  let openAdd = () => {
    setRentalInfo({
      propertyName: '',
      property: '',
      room: '',
      rent: '',
      reporter: '',
    });
    setImage(null);
    setShowAdd(true);
  };
  let hideAdd = () => {
    setShowAdd(false);
  };
  // Validation
  let validation = Yup.object({
    propertyName: Yup.string()
      .trim('Not white space')
      .strict()
      .required('Property name is not empty'),
    property: Yup.string()
      .trim('Not white space')
      .strict()
      .required('Property type is not empty')
      .matches(/(Flat|Bungalow|House)\b/, 'Please input Flat,Buaglow or House'),
    room: Yup.string()
      .trim('Not white space')
      .strict()
      .max(15, 'Please input less than 15 characters')
      .required('Room is not empty'),
    rent: Yup.string()
      .trim('Not white space')
      .strict()
      .max(10, 'Please input less than 15 characters')
      .matches(/^[0-9]*$/, 'Please input only number')
      .required('Input rent price'),
    reporter: Yup.string()
      .trim('Not white space')
      .strict()
      .min(2, 'Please input more than 2 characters')
      .max(15, 'Please input less than 15 characters')
      .required('Please fill your name'),
  });
  let chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    setError(initialeImage);
    setImage(res);
  };
  let validationImage = () => {
    let errorMessage = '';
    if (!image) {
      errorMessage = 'Please choose image';
    }
    if (errorMessage) {
      setError({
        image: errorMessage,
      });
      return false;
    } else {
      setError(initialeImage);
      return true;
    }
  };
  let handleCreateRental = value => {
    let isValid = validationImage();
    let isItem = allRental.find(
      item => item.propertyName === value.propertyName,
    );
    if (isItem) {
      alert('Property Name is existed');
      return false;
    }
    if (isValid) {
      setRentalInfo({...value});
      setShowConfirm(true);
    }
  };
  let handleConfirmRental = (value, image) => {
    dispatch(addRental(value, image));
    setShowAdd(false);
    setShowConfirm(false);
  };
  let hideConfirm = () => {
    setShowConfirm(false);
  };

  let renderLogin = () => {
    return (
      <View
        style={{marginHorizontal: 10, marginVertical: 10, paddingBottom: 10}}>
        <Text style={{marginBottom: 20}}>You need to login first</Text>
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('Login');
          }}>
          Login
        </Button>
      </View>
    );
  };
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  return (
    <SafeAreaView style={style.container}>
      {token ? (
        <>
          <ScrollView style={style.scrollView}>
            {Array.isArray(rentalList) && rentalList.length > 0
              ? rentalList.map((rental, index) => {
                  return (
                    <Card key={index} style={style.card}>
                      <Card.Title title={rental.propertyName} />
                      <Card.Cover
                        source={{
                          uri: `http://10.0.2.2:3000/public/${rental.image}`,
                        }}
                      />
                      <Card.Content>
                        <Paragraph>
                          <Text style={{fontWeight: 'bold'}}>Price : </Text>
                          <Text>{rental.rentPrice}$</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text style={{fontWeight: 'bold'}}>Lessor : </Text>
                          <Text> {rental.reporterName}</Text>
                        </Paragraph>
                      </Card.Content>
                      <Card.Actions style={style.buttonGroup}>
                        <Button
                          mode="contained"
                          onPress={() => {
                            navigation.push('Detail', {
                              id: rental._id,
                            });
                          }}>
                          View
                        </Button>
                      </Card.Actions>
                    </Card>
                  );
                })
              : null}
          </ScrollView>
          <View style={style.addContainer}>
            <Button
              mode="contained"
              style={style.buttonAdd}
              onPress={() => {
                openAdd();
              }}>
              <Icon name="plus" size={25} color="white" />
            </Button>
          </View>
        </>
      ) : (
        renderLogin()
      )}
      <Portal>
        <Dialog visible={showAdd} onDismiss={hideAdd}>
          <Dialog.Title>Add Rental</Dialog.Title>
          <Dialog.Content>
            <Formik
              initialValues={rentalInfo}
              validationSchema={validation}
              onSubmit={handleCreateRental}>
              {formik => {
                return (
                  <View>
                    <TextInput
                      mode="outlined"
                      dense={true}
                      label="Property Name"
                      style={style.input}
                      value={formik.values.propertyName}
                      onChangeText={formik.handleChange('propertyName')}
                      onBlur={formik.handleBlur('propertyName')}
                    />
                    {formik.errors.propertyName &&
                    formik.touched.propertyName ? (
                      <Text style={style.error}>
                        {formik.errors.propertyName}
                      </Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      dense={true}
                      label="Property Type"
                      style={style.input}
                      value={formik.values.property}
                      onChangeText={formik.handleChange('property')}
                      onBlur={formik.handleBlur('property')}
                    />
                    {formik.errors.property && formik.touched.property ? (
                      <Text style={style.error}>{formik.errors.property}</Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      dense={true}
                      label="Bedrooms"
                      style={style.input}
                      value={formik.values.room}
                      onChangeText={formik.handleChange('room')}
                      onBlur={formik.handleBlur('room')}
                    />
                    {formik.errors.room && formik.touched.room ? (
                      <Text style={style.error}>{formik.errors.room}</Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      dense={true}
                      label="Rent Price"
                      style={style.input}
                      value={formik.values.rent}
                      onChangeText={formik.handleChange('rent')}
                      onBlur={formik.handleBlur('rent')}
                    />
                    {formik.errors.rent && formik.touched.rent ? (
                      <Text style={style.error}>{formik.errors.rent}</Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      dense={true}
                      label="Reporter"
                      style={style.input}
                      value={formik.values.reporter}
                      onChangeText={formik.handleChange('reporter')}
                      onBlur={formik.handleBlur('reporter')}
                    />
                    {formik.errors.reporter && formik.touched.reporter ? (
                      <Text style={style.error}>{formik.errors.reporter}</Text>
                    ) : null}
                    <Button
                      mode="contained"
                      style={style.chooseBtn}
                      onPress={() => {
                        chooseImage();
                      }}>
                      Choose Image
                    </Button>
                    {image ? (
                      <Image
                        source={image ? image : null}
                        style={{
                          marginTop: 10,
                          width: 50,
                          height: 50,
                        }}
                      />
                    ) : (
                      <Text style={style.error}>{errorImage.image}</Text>
                    )}
                    <Dialog.Actions style={style.dialogButton}>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          hideAdd();
                        }}>
                        Cancel
                      </Button>
                      <Button
                        mode="contained"
                        style={style.confirmAdd}
                        onPress={formik.handleSubmit}>
                        Ok
                      </Button>
                    </Dialog.Actions>
                  </View>
                );
              }}
            </Formik>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={showConfirm} onDismiss={hideConfirm}>
          <Dialog.Title>Confirm your rental information</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Property Name : </Text>
              <Text>{rentalInfo.propertyName}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Type : </Text>
              <Text>{rentalInfo.property}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Bedrooms : </Text>
              <Text>{rentalInfo.room}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Rent Price : </Text>
              <Text>{rentalInfo.rent}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Reporter Name : </Text>
              <Text>{rentalInfo.reporter}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 10}}>
              <Text style={{fontWeight: 'bold'}}>Image : </Text>
            </Paragraph>
            <Image
              source={image ? image : null}
              style={{
                marginTop: 5,
                width: 50,
                height: 50,
              }}
            />
            <Paragraph style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>Created Date : </Text>
              <Text>{today}</Text>
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideConfirm();
              }}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                handleConfirmRental(rentalInfo, image);
              }}>
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {},
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 10,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  loadingDiv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContainer: {
    marginBottom: 20,
    marginStart: 'auto',
    marginRight: 20,
    width: 60,
    height: 60,
  },
  buttonAdd: {
    flex: 1,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  input: {
    marginBottom: 10,
  },
  chooseBtn: {
    width: '60%',
  },
  confirmAdd: {
    marginStart: 10,
  },
  dialogButton: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
