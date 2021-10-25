import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ActivityIndicator, Button, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {DefaultTheme} from 'react-native-paper';
import {loggedIn, signinAction} from '../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage({navigation}) {
  const loading = useSelector(state => state.rentalReducer.loading);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loggedIn(navigation));
  }, [dispatch]);

  //   Secure password
  let [secure, setSecure] = useState(true);

  let validation = Yup.object({
    email: Yup.string()
      .trim('Not white space')
      .strict()
      .email('Invalid Email')
      .max(30, 'Less than 30 character')
      .min(8, 'At least 8 character')
      .required('Email is not empty'),
    password: Yup.string()
      .trim('Not white space')
      .strict()
      .max(30, 'Less than 30 character')
      .min(8, 'At least 8 character')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Minimum 8 characters, at least one letter , one number and no special character',
      )
      .required('Password is not empty'),
  });
  let value = {
    email: '',
    password: '',
  };

  let handleLogin = value => {
    dispatch(signinAction(value, navigation));
  };
  if (loading) {
    return <ActivityIndicator style={style.loadingDiv} animating={true} />;
  }

  return (
    <View style={style.loginWrapper}>
      <View style={[style.loginContainer]}>
        <Text style={style.logo}>Rental Z</Text>
        <Formik
          initialValues={value}
          validationSchema={validation}
          onSubmit={handleLogin}>
          {formik => {
            return (
              <View style={style.formContainer}>
                <TextInput
                  dense={true}
                  label="email"
                  mode="outlined"
                  style={style.input}
                  onChangeText={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email ? (
                  <Text style={style.errors}>{formik.errors.email}</Text>
                ) : null}
                <TextInput
                  dense={true}
                  label="password"
                  secureTextEntry={secure ? true : false}
                  mode="outlined"
                  right={
                    <TextInput.Icon
                      name="eye"
                      onPress={() => {
                        setSecure(!secure);
                      }}
                    />
                  }
                  value={formik.values.password}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  style={style.input}
                />
                {formik.errors.password && formik.touched.password ? (
                  <Text style={style.errors}>{formik.errors.password}</Text>
                ) : null}
                <Button
                  mode="contained"
                  onPress={formik.handleSubmit}
                  style={style.loginButton}>
                  Login
                </Button>
              </View>
            );
          }}
        </Formik>

        <Button
          mode="contained"
          style={style.signupButton}
          theme={theme}
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          Signup
        </Button>
      </View>
    </View>
  );
}
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0985f6',
  },
};
const style = StyleSheet.create({
  loginWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    maxHeight: '100%',
    width: '90%',
    // backgroundColor: 'skyblue',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 40,
    elevation: 3,
    shadowColor: '#52006A',
  },

  logo: {
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 20,
    color: '#6200ee',
  },
  input: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  loginButton: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  signupButton: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  errors: {
    color: 'red',
    marginHorizontal: 10,
  },
  loadingDiv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
