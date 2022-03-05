import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
//import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
  ArchitectsDaughter: require("../assets/fonts/ArchitectsDaughter-Regular.ttf"),
  Calligraffitti: require("../assets/fonts/Calligraffitti-Regular.ttf"),
};

export default class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      quantity: 0,
      sold: 0,
      preview_images: this.props.product.value.preview_image,
      product_id: this.props.product.key,
      product_data: this.props.product.value,
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

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchQuantity();
  }

  fetchQuantity = () => {
    let quantity, sold;
    firebase
      .database()
      .ref("/products/" + this.state.product_id)
      .on("value", (snapshot) => {
        quantity = snapshot.val().quantity;
        sold = snapshot.val().sold;
        this.setState({ quantity: quantity });
        this.setState({ sold: sold });
      });
  };

  render() {
    let images = {
      image_1: require("../assets/image_1.jpg"),
      image_2: require("../assets/image_2.jpg"),
      image_3: require("../assets/image_3.jpg"),
      image_4: require("../assets/image_4.jpg"),
      image_5: require("../assets/image_5.jpg"),
    };
    let kg = this.state.quantity;

    let product = this.state.product_data;
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <View
            style={
              this.state.light_theme
                ? styles.cardContainer
                : styles.cardContainerDark
            }
          >
            <Image
              source={images[this.state.preview_images]}
              style={styles.productImage}
            ></Image>

            <View style={styles.titleContainer}>
              <Text style={styles.productTitleText}>Name:{product.name}</Text>
              <Text style={styles.productQuantityText}>
                Quantity:{Math.round((kg + Number.EPSILON) * 100) / 100} Kg
              </Text>
              <Text style={styles.descriptionText}>
                Description: {product.description}
              </Text>
              <Text style={styles.descriptionText}>
                Sold: {this.state.sold}{" "}
                {this.state.sold <= 1 ? "time" : "times"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sellContainer}
              onPress={() => {
                this.props.navigation.navigate("ProductScreen", {
                  name: this.state.product_data.name,
                  //quantity: this.state.product_data.quantity,
                  description: this.state.product_data.description,
                  preview_image: this.state.product_data.preview_image,
                  product_id: this.state.product_id,
                });
              }}
            >
              <View style={styles.sellButton}>
                <Text style={styles.sellText}>Sell</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sellContainer}
              onPress={() => {
                this.props.navigation.navigate("AddQuantityScreen", {
                  name: this.state.product_data.name,
                  //quantity: this.state.product_data.quantity,
                  description: this.state.product_data.description,
                  preview_image: this.state.product_data.preview_image,
                  product_id: this.state.product_id,
                });
              }}
            >
              <View style={styles.sellButton}>
                <Text style={styles.sellText}>Add Quantity</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: RFValue(25),
    backgroundColor: "#fcf568",
    borderRadius: RFValue(20),
  },
  cardContainerDark: {
    margin: RFValue(25),
    backgroundColor: "#49fce2",
    borderRadius: RFValue(20),
  },
  productImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250),
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center",
  },
  productTitleText: {
    fontSize: RFValue(30),
    fontFamily: "Calligraffitti",
    color: "#f05668",
  },
  productQuantityText: {
    fontSize: RFValue(25),
    fontFamily: "Calligraffitti",
    color: "#f05668",
  },
  descriptionText: {
    fontFamily: "Calligraffitti",
    fontSize: RFValue(23),
    color: "#f05668",
    paddingTop: RFValue(10),
  },
  sellContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
  },
  sellButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30),
  },
  sellText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
});
