import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  TextInput,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
  ArchitectsDaughter: require("../assets/fonts/ArchitectsDaughter-Regular.ttf"),
  Calligraffitti: require("../assets/fonts/Calligraffitti-Regular.ttf"),
};

export default class ProductScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
      fontsLoaded: false,
      quantity: 0,
      gram100: 100,
      gram250: 250,
      gram500: 500,
      gram1000: 1000,
      preview_image: this.props.route.params.preview_image,
      product_id: this.props.route.params.product_id,
      sold: 0,
    };
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

  fetchQuantity = () => {
    let quantity, sold;
    firebase
      .database()
      .ref("/products/" + this.state.product_id)
      .on("value", (snapshot) => {
        quantity = snapshot.val().quantity * 1000;
        sold = snapshot.val().sold;
        this.setState({ quantity: quantity });
        this.setState({ sold: sold });
      });
  };

  weightAction = async (grams) => {
    let quantity = this.state.quantity;
    let kg = grams / 1000;
    if (quantity-kg<0) {
      Alert.alert(
        "Error",
        "Weight is above the given quantity",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      firebase
        .database()
        .ref("products")
        .child(this.state.product_id)
        .update({
          quantity: firebase.database.ServerValue.increment(-grams / 1000),
          sold: firebase.database.ServerValue.increment(1),
        })
        .then(() => {
          Alert.alert("Hurray", "Product Has been Sold", [{ text: "OK" }], {
            cancelable: false,
          });
          this.setState({
            gram100: 100,
            gram250: 250,
            gram500: 500,
            gram1000: 1000,
          });
        });
    }
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchQuantity();
  }

  render() {
    let images = {
      image_1: require("../assets/image_1.jpg"),
      image_2: require("../assets/image_2.jpg"),
      image_3: require("../assets/image_3.jpg"),
      image_4: require("../assets/image_4.jpg"),
      image_5: require("../assets/image_5.jpg"),
    };
    let grams = this.state.quantity / 1000;

    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.container : styles.containerDark
          }
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
                Sell Product
              </Text>
            </View>
          </View>
          <Image
            source={images[this.state.preview_image]}
            style={styles.productImage}
          ></Image>
          <View style={styles.productDetailsContainer}>
            <Text style={styles.productDetailsText}>
              Name: {this.props.route.params.name}
            </Text>
            <Text style={styles.productDetailsText}>
              Quantity: {Math.round((grams + Number.EPSILON) * 100) / 100} Kg
            </Text>
            <Text style={styles.productDetailsText}>
              Description: {this.props.route.params.description}
            </Text>
            <Text style={styles.productDetailsText}>
              Sold: {this.state.sold} {this.state.sold <= 1 ? "time" : "times"}
            </Text>
          </View>
          <View style={styles.weightButtonContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ gram100: (this.state.gram100 += 100) });
                }}
              >
                <Ionicons
                  name={"add-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => {
                  this.weightAction(this.state.gram100);
                }}
              >
                <Text style={styles.sellText}>{this.state.gram100} Grams</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ gram250: (this.state.gram250 += 250) });
                }}
              >
                <Ionicons
                  name={"add-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => {
                  this.weightAction(this.state.gram250);
                }}
              >
                <Text style={styles.sellText}>{this.state.gram250} Grams</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ gram500: (this.state.gram500 += 500) });
                }}
              >
                <Ionicons
                  name={"add-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => {
                  this.weightAction(this.state.gram500);
                }}
              >
                <Text style={styles.sellText}>{this.state.gram500} Grams</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ gram1000: (this.state.gram1000 += 1000) });
                }}
              >
                <Ionicons
                  name={"add-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => {
                  this.weightAction(this.state.gram1000);
                }}
              >
                <Text style={styles.sellText}>
                  {this.state.gram1000 / 1000} Kg
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
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
    marginTop: RFValue(20),
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 50,
    height: 50,
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
  productImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250),
    marginTop: RFValue(10),
  },
  productDetailsContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center",
  },
  productDetailsText: {
    fontSize: RFValue(25),
    fontFamily: "Calligraffitti",
    color: "#f1ff26",
  },
  weightButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
    marginTop: RFValue(10),
  },
  weightButton: {
    width: RFValue(180),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30),
    marginTop: 10,
  },
  sellText: {
    color: "white",
    fontFamily: "ArchitectsDaughter",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  buttonContainer: {
    flexDirection: "row",
  },
  addButton: {
    width: RFValue(40),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#e0f542",
    borderRadius: RFValue(30),
    marginTop: 10,
    marginLeft: RFValue(-10),
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
    marginLeft: RFValue(5),
  },
});
