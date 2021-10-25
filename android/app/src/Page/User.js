import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button, Card, Paragraph, Title} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getUserDetail} from '../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function User({navigation}) {
  const userDetail = useSelector(state => state.rentalReducer.userDetail);
  let rentalList = useSelector(state => state.rentalReducer.rentalList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserDetail());
  }, [dispatch]);
  let logout = async () => {
    await dispatch({
      type: 'EMPTY_ARRAY',
    });
    await dispatch({
      type: 'SET_TOKEN',
      token: false,
    });
    await AsyncStorage.clear();
    return navigation.push('TabHome');
  };
  return (
    <View>
      <Card style={{marginHorizontal: 10, marginVertical: 10}}>
        <Card.Content>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>First Name : </Text>
            <Text>{userDetail[0]?.firstName}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Last Name : </Text>
            <Text>{userDetail[0]?.lastName}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{fontWeight: 'bold'}}>Email : </Text>
            <Text>{userDetail[0]?.email}</Text>
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button
            style={{marginStart: 'auto'}}
            mode="contained"
            onPress={() => {
              logout();
            }}>
            Signout
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
