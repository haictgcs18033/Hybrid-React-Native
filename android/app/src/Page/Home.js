import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  Card,
  Paragraph,
  Title,
  Button,
  Portal,
  Dialog,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {getAllRental} from '../redux/action';
import moment from 'moment';
export default function Home({navigation}) {
  let allRental = useSelector(state => state.rentalReducer.allRental);

  const [showDialog, setShow] = useState(false);
  const [rentalInfor, setRentalInfor] = useState({
    propertyName: '',
    property: '',
    rent: '',
    room: '',
    reporterName: '',
    note: '',
    image: '',
  });
  let {propertyName, property, rent, room, reporterName, note, image, date} =
    rentalInfor;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllRental());
  }, [dispatch]);
  let hideDialog = () => {
    setShow(false);
  };
  let openDialog = rental => {
    setRentalInfor({
      propertyName: rental.propertyName,
      property: rental.property,
      rent: rental.rentPrice,
      reporterName: rental.reporterName,
      room: rental.rooms,
      note: rental.note,
      image: rental.image,
      date: rental.date,
    });
    setShow(true);
  };
  return (
    <SafeAreaView>
      <ScrollView>
        {allRental?.map((rental, index) => {
          return (
            <Card key={index} style={styles.card}>
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
                  <Text>{rental.reporterName}</Text>
                </Paragraph>
              </Card.Content>
              <Card.Actions style={styles.buttonGroup}>
                <Button
                  mode="contained"
                  onPress={() => {
                    openDialog(rental);
                  }}>
                  View
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
      </ScrollView>
      <Portal>
        <Dialog visible={showDialog} onDismiss={hideDialog}>
          <Dialog.Title>Rental Information</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Property Name : </Text>
              <Text>{propertyName}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Type : </Text>
              <Text>{property}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Bedrooms : </Text>
              <Text>{room}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Rent Price : </Text>
              <Text>{rent}$</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Reporter : </Text>
              <Text>{reporterName}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 10}}>
              <Text style={{fontWeight: 'bold'}}>Image : </Text>
            </Paragraph>
            <Image
              style={styles.rentalImage}
              source={{uri: `http://10.0.2.2:3000/public/${image}`}}
            />
            <Paragraph>
              <Text style={{fontWeight: 'bold'}}>Created Date : </Text>
              <Text>{moment(date).format('L')}</Text>
            </Paragraph>
            <Paragraph style={{marginBottom: 20}}>
              <Text style={{fontWeight: 'bold'}}>Note : </Text>
              {Array.isArray(note)
                ? note.map((note, index) => {
                    return <Text key={index}>{note.description}</Text>;
                  })
                : null}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideDialog();
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  rentalImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});
