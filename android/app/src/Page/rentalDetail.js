import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  DefaultTheme,
  Dialog,
  Paragraph,
  Portal,
  TextInput,
  Title,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  addNote,
  deleteRental,
  getAllRental,
  getRentalDetail,
  updateRental,
} from '../redux/action';
import {Formik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
export default function rentalDetail({route, navigation}) {
  let {id} = route.params;
  let rentalDetail = useSelector(state => state.rentalReducer.rentalDetail);
  console.log(rentalDetail);
  let loading = useSelector(state => state.rentalReducer.loading);
  let allRental = useSelector(state => state.rentalReducer.allRental);
  let {propertyName, property, rooms, rentPrice, reporterName, image, note} =
    rentalDetail;
  // console.log(rentalDetail);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllRental());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getRentalDetail(id));
  }, [dispatch, id]);
  let [showDialog, setShowDialog] = useState(false);
  let [showDelete, setShowDelete] = useState(false);
  let [showDialogNote, setShowNote] = useState(false);
  let [rentalInfo, setRental] = useState({
    id: '',
    propertyName: '',
    property: '',
    room: '',
    rent: '',
    reporter: '',
    image: '',
  });
  let [data, setData] = useState({
    id: '',
    description: '',
  });
  // Update
  let hideDialog = () => {
    setShowDialog(false);
  };
  let openDialog = () => {
    setRental({
      id: id,
      propertyName: propertyName,
      property: property,
      rent: rentPrice.toString(),
      room: rooms,
      reporter: reporterName,
      image: image,
    });
    setShowDialog(true);
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
      .required('Property is not empty')
      .matches(/(Flat|Bungalow|House)\b/, 'Please input Flat,Buaglow or House'),
    room: Yup.string()
      .trim('Not white space')
      .strict()
      .min(1, 'Please input more than 1 characters')
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
  let handleUpdateRental = value => {
    // let isItem = allRental.find(
    //   item => item.propertyName === value.propertyName,
    // );
    // if (isItem) {
    //   alert('Property Name is existed');
    //   return false;
    // }
    dispatch(updateRental(value, navigation));
    setShowDialog(false);
  };
  // Delete
  let hideDelete = () => {
    setShowDelete(false);
  };
  let openDelete = () => {
    setShowDelete(true);
  };

  let confirmDelete = () => {
    dispatch(deleteRental(id, navigation));
    setShowDelete(false);
  };
  // Add note
  let validationNote = Yup.object({
    description: Yup.string()
      .trim('Not white space')
      .strict()
      .required('Note description is required'),
  });
  let openDialogNote = id => {
    setData({...data, id: id});
    setShowNote(true);
  };
  let hideDialogNote = () => {
    setShowNote(false);
  };
  let handleAddNote = value => {
    dispatch(addNote(value, navigation));
    setShowNote(false);
  };
  if (loading) {
    return <ActivityIndicator style={style.loadingDiv} animating={true} />;
  }
  return (
    <View style={style.container}>
      <ScrollView style={style.content}>
        <Image
          style={style.rentalImage}
          source={{uri: `http://10.0.2.2:3000/public/${image}`}}
        />
        <View style={{marginHorizontal: 20, marginVertical: 10, flex: 1}}>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Property Name : </Text>
            <Text>{propertyName}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Type : </Text>
            <Text>{property}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Price : </Text>
            <Text>{rentPrice}$</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Bedrooms : </Text>
            <Text>{rooms}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Reporter : </Text>
            <Text>{reporterName}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Created Date : </Text>
            <Text>{moment(rentalDetail.date).format('L')}</Text>
          </Paragraph>
          <Text style={{fontWeight: 'bold'}}>Note : </Text>
          {note ? (
            note.map((note, index) => {
              return <Text key={index}>{note.description}</Text>;
            })
          ) : (
            <Text>There are not any notes</Text>
          )}
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showDialogNote} onDismiss={hideDialogNote}>
          <Formik
            initialValues={data}
            validationSchema={validationNote}
            onSubmit={handleAddNote}>
            {formik => {
              return (
                <View style={{padding: 20}}>
                  <Title>Add Note</Title>
                  <TextInput
                    mode="outlined"
                    value={formik.values.description}
                    style={style.textInput}
                    dense={true}
                    label={'Note description'}
                    onChangeText={formik.handleChange('description')}
                    onBlur={formik.handleBlur('description')}></TextInput>
                  {formik.errors.description && formik.touched.description ? (
                    <Text style={style.error}>{formik.errors.description}</Text>
                  ) : null}
                  <Dialog.Actions>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        hideDialogNote();
                      }}>
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      style={{marginStart: 10}}
                      onPress={formik.handleSubmit}>
                      Ok
                    </Button>
                  </Dialog.Actions>
                </View>
              );
            }}
          </Formik>
        </Dialog>
      </Portal>
      <View style={style.buttonGroup}>
        <Button
          style={style.updateBtn}
          mode="contained"
          theme={themeUpdate}
          onPress={() => {
            openDialog();
          }}>
          Update
        </Button>
        <Button
          style={style.deleteBtn}
          mode="contained"
          theme={themeDelete}
          onPress={() => {
            openDelete();
          }}>
          Delete
        </Button>
        <Button
          style={style.noteBtn}
          mode="contained"
          onPress={() => {
            openDialogNote(id);
          }}>
          Add Note
        </Button>
      </View>
      <Portal>
        <Dialog visible={showDialog} onDismiss={hideDialog}>
          <Dialog.Content>
            <Formik
              initialValues={rentalInfo}
              validationSchema={validation}
              onSubmit={handleUpdateRental}>
              {formik => {
                return (
                  <View>
                    <Title style={{marginBottom: 10}}>
                      Update Rental Information
                    </Title>
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
                      label="Room"
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

                    <Dialog.Actions style={style.dialogButton}>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          hideDialog();
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
        <Dialog visible={showDelete} onDismiss={hideDelete}>
          <Dialog.Title
            style={{
              color: 'red',
            }}>
            Warning
          </Dialog.Title>
          <Dialog.Content>
            <Text>Delete this item ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="outline"
              onPress={() => {
                hideDelete();
              }}>
              Cancel
            </Button>
            <Button
              style={style.deleteConfirm}
              mode="contained"
              onPress={() => {
                confirmDelete();
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
const themeUpdate = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0985f6',
  },
};
const themeDelete = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff0000',
  },
};
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  rentalImage: {
    width: '100%',
    height: 300,
  },
  content: {
    backgroundColor: 'white',

    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  updateBtn: {
    flexGrow: 1,
  },
  deleteBtn: {
    flexGrow: 1,
  },
  noteBtn: {
    flexGrow: 1,
    borderRadius: 0,
  },
  deleteConfirm: {
    marginStart: 10,
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
    marginTop: 0,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  loadingDiv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
