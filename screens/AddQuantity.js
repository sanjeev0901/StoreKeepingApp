import React from "react";
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

export default class AddQuantity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
      fontsLoaded: false,
      quantity: 0,
      kg10: 10,
      kg25: 25,
      kg50: 50,
      kg100: 100,
      preview_image: this.props.route.params.preview_image,
      product_id: this.props.route.params.product_id,
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
    let quantity;
    firebase
      .database()
      .ref("/products/" + this.state.product_id)
      .on("value", (snapshot) => {
        quantity = snapshot.val().quantity;
        this.setState({ quantity: quantity });
      });
  };

  async weightAction(kg) {
    firebase
      .database()
      .ref("products")
      .child(this.state.product_id)
      .child("quantity")
      .set(firebase.database.ServerValue.increment(kg))
      .then(() => {
        Alert.alert("Hurray", "Quantity has been added!!", [{ text: "OK" }], {
          cancelable: false,
        });
      });
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  minusButton = (kg, quantity) => {
    if (kg <= quantity) {
      return true;
    } else {
      return false;
    }
  };

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
                Add Quantity
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
              Quantity: {this.state.quantity} Kg
            </Text>
            <Text style={styles.productDetailsText}>
              Description: {this.props.route.params.description}
            </Text>
          </View>
          <View style={styles.weightButtonContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ kg10: (this.state.kg10 += 10) });
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
                  this.weightAction(this.state.kg10);
                }}
              >
                <Text style={styles.sellText}>
                  {this.state.kg10 >= 100
                    ? this.state.kg10 / 100
                    : this.state.kg10}{" "}
                  {this.state.kg10 >= 100 ? "Ton" : "Kg"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.minusButton}
                onPress={() => {
                  this.setState({ kg10: (this.state.kg10 -= 10) });
                }}
                disabled={this.minusButton(this.state.kg10, 10)}
              >
                <Ionicons
                  name={"remove-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ kg25: (this.state.kg25 += 25) });
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
                  this.weightAction(this.state.kg25);
                }}
              >
                <Text style={styles.sellText}>
                  {this.state.kg25 >= 100
                    ? this.state.kg25 / 100
                    : this.state.kg25}{" "}
                  {this.state.kg25 >= 100 ? "Ton" : "Kg"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.minusButton}
                onPress={() => {
                  this.setState({ kg25: (this.state.kg25 -= 25) });
                }}
                disabled={this.minusButton(this.state.kg25, 25)}
              >
                <Ionicons
                  name={"remove-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ kg50: (this.state.kg50 += 50) });
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
                  this.weightAction(this.state.kg50);
                }}
              >
                <Text style={styles.sellText}>
                  {this.state.kg50 >= 100
                    ? this.state.kg50 / 100
                    : this.state.kg50}{" "}
                  {this.state.kg50 >= 100 ? "Ton" : "Kg"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.minusButton}
                onPress={() => {
                  this.setState({ kg50: (this.state.kg50 -= 50) });
                }}
                disabled={this.minusButton(this.state.kg50, 50)}
              >
                <Ionicons
                  name={"remove-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.setState({ kg100: (this.state.kg100 += 100) });
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
                  this.weightAction(this.state.kg100);
                }}
              >
                <Text style={styles.sellText}>
                  {this.state.kg100 / 100} Ton
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.minusButton}
                onPress={() => {
                  this.setState({ kg100: (this.state.kg100 -= 100) });
                }}
                disabled={this.minusButton(this.state.kg100, 100)}
              >
                <Ionicons
                  name={"remove-circle"}
                  size={RFValue(25)}
                  style={styles.icons}
                />
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
  minusButton: {
    width: RFValue(40),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#e0f542",
    borderRadius: RFValue(30),
    marginTop: 10,
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
    marginLeft: RFValue(5),
  },
});
