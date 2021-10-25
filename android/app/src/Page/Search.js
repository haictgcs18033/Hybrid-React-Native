import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {Button, Dialog, Paragraph, Portal, Searchbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {searchRental} from '../redux/action';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
export default function Search({navigation}) {
  let searchData = useSelector(state => state.rentalReducer.searchData);
  const [showDialog, setShow] = useState(false);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState({
    searchName: '',
    searchType: '',
    searchPrice: '',
  });
  const [rentalInfor, setRentalInfor] = useState({
    property: '',
    rent: '',
    room: '',
    reporterName: '',
    note: '',
    image: '',
  });
  let {propertyName, property, rent, room, reporterName, note, image, date} =
    rentalInfor;
  // Dropdown picker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('name');
  const [items, setItems] = useState([
    {label: 'Property Name', value: 'name'},
    {label: 'Property Type', value: 'type'},
    {label: 'Property Price', value: 'price'},
  ]);

  const onSearchName = query => {
    setSearchQuery({...searchQuery, searchName: query});
    let data = {
      searchName: query,
    };
    dispatch(searchRental(data));
  };
  const onSearchType = query => {
    setSearchQuery({...searchQuery, searchType: query});
    let data = {
      searchType: query,
    };
    dispatch(searchRental(data));
  };
  const onSearchPrice = query => {
    setSearchQuery({...searchQuery, searchPrice: query});
    let data = {
      searchPrice: query,
    };
    dispatch(searchRental(data));
  };

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
  let switchOnChange = value => {
    switch (value) {
      case 'name':
        return onSearchName;
      case 'type':
        return onSearchType;
      case 'price':
        return onSearchPrice;
    }
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 10,
        }}>
        <Searchbar
          style={{marginHorizontal: 10}}
          placeholder={`Search ${value}`}
          onChangeText={switchOnChange(value)}
          value={searchQuery}
        />
      </View>
      <DropDownPicker
        placeholder="Select another search type"
        style={{
          backgroundColor: 'white',
        }}
        containerStyle={{
          minHeight: open ? 180 : 50,
          paddingHorizontal: 10,
          paddingBottom: 10,
          backgroundColor: 'white',
        }}
        dropDownContainerStyle={{
          marginStart: 10,
        }}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={value => {
          setValue(value);
          setSearchQuery({
            searchName: '',
            searchType: '',
            searchPrice: '',
          });
          dispatch({
            type: 'CLEAR_SEARCH',
          });
        }}
      />

      <ScrollView>
        {Array.isArray(searchData) && searchData.length > 0 ? (
          searchData.map((rental, index) => {
            return (
              <View style={style.card} key={index}>
                <Text style={style.text}>{rental.propertyName}</Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    openDialog(rental);
                  }}>
                  View
                </Button>
              </View>
            );
          })
        ) : (
          <Text style={{marginTop: 80, fontSize: 20, textAlign: 'center'}}>
            No value
          </Text>
        )}
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
              style={style.rentalImage}
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
    </View>
  );
}
const style = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  text: {
    lineHeight: 35,
    fontWeight: 'bold',
    fontSize: 20,
  },
  rentalImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});
