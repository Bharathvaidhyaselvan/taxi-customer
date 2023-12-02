import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Share
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { bold, f_xl, app_name, refer, regular, screenHeight, screenWidth, get_referral_message, api_url } from '../config/Constants';
import Lottie from 'lottie-react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';

const Refer = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [code, setCode] = useState(""); 

  const go_back = () => {
    navigation.goBack();
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      call_get_referral_message();
    });

    return (
        unsubscribe
    );
}, []);

  const call_get_referral_message = () => {
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + get_referral_message,
      data: {  customer_id: global.id, lang: global.lang}
    })
    .then(async response => {
      setLoading(false);
      setData(response.data.result);
      setCode(response.data.code);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const open_sms = async()=>{
    try {
      const result = await Share.share({
        title: "Share your referal code.",
        message: data.referral_message + " " + code, 
        url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
      });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.header]}>
          <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>Refer and Earn</Text>
          </View>
        </View>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Lottie style={{ height: 200, width: 200 }} source={refer} autoPlay loop />
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.refering}>Refer your friends and get</Text>
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <Text style={styles.description}>Get referal bonus of {global.currency} {data.referral_bonus} for each trip when your code is used by others.</Text>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={open_sms.bind(this)} style={{ height: 40, alignSelf: 'center', justifyContent: 'center', position: 'absolute', bottom: 10, backgroundColor: colors.theme_fg, width: 300, borderRadius: 10 }}>
        <Text adjustsFontSizeToFit={true} style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14, textAlign: 'center' }}>Refer a Friends</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
  },
  header: {
    height: 60,
    backgroundColor: colors.theme_bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    width: '100%'
  },
  refering:{ fontSize:20, fontFamily:bold, color:colors.theme_fg_two },
  description:{ color:colors.grey, fontFamily:regular, fontSize:14},
});

export default Refer;