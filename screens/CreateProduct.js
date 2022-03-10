import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
  ArchitectsDaughter: require("../assets/fonts/ArchitectsDaughter-Regular.ttf"),
  Calligraffitti: require("../assets/fonts/Calligraffitti-Regular.ttf"),
};

export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image_1",
      dropdownHeight: 30,
      light_theme: true,
      name: "",
      quantity: 0,
      description: "",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" ? true : false });
      });
  };

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async addProducts() {
    let quantity = this.state.quantity;
    if (this.state.name && this.state.quantity && this.state.description) {
      let productData = {
        preview_image: this.state.previewImage,
        name: this.state.name,
        description: this.state.description,
        quantity: parseInt(this.state.quantity),
        shopkeeper: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        shopkeeper_uid: firebase.auth().currentUser.uid,
        sold: 0,
      };
      await firebase
        .database()
        .ref("/products/" + Math.random().toString(36).slice(2))
        .set(productData)
        .then(() => {
          Alert.alert(
            "Hurray",
            "Product Has Been Added To Your Market",
            [{ text: "OK" }],
            {
              cancelable: false,
            }
          );
        });
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("Feed");
      this.setState({ name: "", quantity: 0, description: "" });
    } else {
      Alert.alert(
        "Error",
        "All fields are required!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }

  render() {
    let preview_images = {
      image_1: require("../assets/image_1.jpg"),
      image_2: require("../assets/image_2.jpg"),
      image_3: require("../assets/image_3.jpg"),
      image_4: require("../assets/image_4.jpg"),
      image_5: require("../assets/image_5.jpg"),
    };
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <KeyboardAvoidingView
          style={
            this.state.light_theme ? styles.container : styles.containerDark
          }
          behavior='padding'
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleText
                    : styles.appTitleTextDark
                }
              >
                Create Product
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}
              ></Image>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Carrot", value: "image_1" },
                    { label: "Onion", value: "image_2" },
                    { label: "Potato", value: "image_3" },
                    { label: "Raddish", value: "image_4" },
                    { label: "Tomato", value: "image_5" },
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 40,
                    borderRadius: 20,
                    marginBottom: 10,
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={
                    this.state.light_theme
                      ? { backgroundColor: "#fcf568" }
                      : { backgroundColor: "#49fce2" }
                  }
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={
                    this.state.light_theme
                      ? { backgroundColor: "#fcf568" }
                      : { backgroundColor: "#49fce2" }
                  }
                  labelStyle={{
                    color: "black",
                    fontFamily: "Calligraffitti",
                    fontSize: 15,
                  }}
                  arrowStyle={{
                    color: "black",
                  }}
                  onChangeItem={(item) =>
                    this.setState({
                      previewImage: item.value,
                    })
                  }
                />
              </View>
              <TextInput
                style={
                  this.state.light_theme
                    ? [
                        styles.inputFont,
                        styles.inputFontExtra,
                        styles.inputTextBig,
                      ]
                    : [
                        styles.inputFontDark,
                        styles.inputFontExtra,
                        styles.inputTextBig,
                      ]
                }
                onChangeText={(name) => this.setState({ name: name })}
                placeholder={"Enter Product Name"}
                value={this.state.name}
                placeholderTextColor={
                  this.state.light_theme ? "#f518a8" : "#eff542"
                }
              />
              <TextInput
                style={
                  this.state.light_theme
                    ? [
                        styles.inputFont,
                        styles.inputFontExtra,
                        styles.inputTextBig,
                      ]
                    : [
                        styles.inputFontDark,
                        styles.inputFontExtra,
                        styles.inputTextBig,
                      ]
                }
                onChangeText={(quantity) =>
                  this.setState({ quantity: quantity })
                }
                value={this.state.quantity}
                placeholder={"Quantity in Kg"}
                placeholderTextColor={
                  this.state.light_theme ? "#f518a8" : "#eff542"
                }
              />

              <TextInput
                style={
                  this.state.light_theme
                    ? [
                        styles.inputFont,
                        styles.inputFontExtra,
                        styles.inputTextBig,
                      ]
                    : [
                        styles.inputFontDark,
                        styles.inputFontExtra,
                        styles.inputTextBig,
                      ]
                }
                value={this.state.description}
                onChangeText={(description) =>
                  this.setState({ description: description })
                }
                placeholder={"Description"}
                placeholderTextColor={
                  this.state.light_theme ? "#f518a8" : "#eff542"
                }
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.addProducts()}
              >
                <Text
                  style={
                    this.state.light_theme
                      ? styles.submitButtonText
                      : styles.submitButtonTextDark
                  }
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
        </KeyboardAvoidingView>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffa44a",
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#54669e",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "#6d1ef7",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  appTitleTextDark: {
    color: "#fff64a",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain",
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "#ebeb13",
    borderWidth: RFValue(3),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    fontSize: 20,
    color: "#f518a8",
    fontFamily: "ArchitectsDaughter",
  },
  inputFontDark: {
    height: RFValue(40),
    borderColor: "#e37764",
    borderWidth: RFValue(3),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    fontSize: 20,
    color: "#eff542",
    fontFamily: "ArchitectsDaughter",
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: "top",
    padding: RFValue(5),
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontFamily: "Bubblegum-Sans",
    color: "#6d1ef7",
    fontSize: 30,
  },
  submitButtonTextDark: {
    fontFamily: "Bubblegum-Sans",
    color: "#42f5ad",
    fontSize: 30,
  },
});
