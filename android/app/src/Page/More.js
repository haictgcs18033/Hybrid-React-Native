import React, {useState} from 'react';
import {View, StyleSheet, Vibration} from 'react-native';
import {Button, DefaultTheme} from 'react-native-paper';
import {Dialog, Portal} from 'react-native-paper';
import RNBeep from 'react-native-a-beep';
export default function More() {
  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);
  return (
    <View>
      <Button
        style={{marginHorizontal: 20, marginVertical: 20}}
        mode="contained"
        onPress={() => {
          showDialog();
        }}>
        Open
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Button
              style={style.button}
              mode="contained"
              onPress={() => {
                RNBeep.beep();
              }}
              title="Beep Success">
              Beep
            </Button>
            <Button
              style={style.button}
              mode="contained"
              theme={themeVibrate}
              onPress={() => Vibration.vibrate(1000)}
              title="Beep Success">
              Vibration
            </Button>
            <Button
              mode="contained"
              style={style.button}
              theme={themeCancel}
              onPress={() => {
                hideDialog();
              }}>
              Cancel
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}
const themeVibrate = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
  },
};
const themeCancel = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'red',
  },
};
const style = StyleSheet.create({
  button: {
    marginBottom: 10,
  },
});
