import React from "react";
import { Image as ExpoImage } from "expo-image";
import { View, StyleSheet } from "react-native";

const placeholderImg = require("../../assets/placeholder.png");

const ExpoImageWithPlaceholder = ({ source, style, ...props }) => {
  let imgSource = source;
  if (!imgSource || (typeof imgSource === "object" && !imgSource.uri)) {
    imgSource = placeholderImg;
  }
  return (
    <ExpoImage
      source={imgSource}
      style={style}
      placeholder={placeholderImg}
      contentFit="cover"
      transition={300}
      {...props}
    />
  );
};

export default ExpoImageWithPlaceholder;
