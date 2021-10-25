import {Formik} from 'formik';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {signupAction} from '../redux/action';
export default function Signup() {
  const loading = useSelector(state => state.rentalReducer.loading);
  let [secure, setSecure] = useState(true);
  const dispatch = useDispatch();
  let validation = Yup.object({
    firstName: Yup.string()
      .trim('Not white space')
      .strict()
      .max(30, 'Less than 30 character')
      .min(1, 'At least 1 character')
      .required('First name is not empty'),
    lastName: Yup.string()
      .trim('Not white space')
      .strict()
      .max(30, 'Less than 30 character')
      .min(1, 'At least 1 character')
      .required('Last name is not empty'),
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  let handleSignup = value => {
    dispatch(signupAction(value));
  };
  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }
  return (
    <View style={style.loginWrapper}>
      <View style={[style.loginContainer]}>
        <Text style={style.logo}>Signup Account</Text>
        <Formik
          initialValues={value}
          validationSchema={validation}
          onSubmit={handleSignup}>
          {formik => {
            return (
              <View style={style.formContainer}>
                <TextInput
                  dense={true}
                  label="First Name"
                  mode="outlined"
                  style={style.input}
                  onChangeText={formik.handleChange('firstName')}
                  onBlur={formik.handleBlur('firstName')}
                  value={formik.values.firstName}
                />
                {formik.errors.firstName && formik.touched.firstName ? (
                  <Text style={style.errors}>{formik.errors.firstName}</Text>
                ) : null}
                <TextInput
                  dense={true}
                  label="Last Name"
                  mode="outlined"
                  style={style.input}
                  onChangeText={formik.handleChange('lastName')}
                  onBlur={formik.handleBlur('lastName')}
                  value={formik.values.lastName}
                />
                {formik.errors.lastName && formik.touched.lastName ? (
                  <Text style={style.errors}>{formik.errors.lastName}</Text>
                ) : null}
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
                  style={style.signupButton}
                  onPress={formik.handleSubmit}>
                  Signup
                </Button>
              </View>
            );
          }}
        </Formik>
      </View>
    </View>
  );
}
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

  signupButton: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  errors: {
    color: 'red',
    marginHorizontal: 10,
  },
});
