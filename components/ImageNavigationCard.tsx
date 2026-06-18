import React, { FC } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { BlurView } from 'expo-blur';

interface ImageNavigationCardProps {
  title: string;
  imageBackground: ImageSourcePropType;
  route: Href;
  searchTerm?: string;
  height?: number;
}

const ImageNavigationCard: FC<ImageNavigationCardProps> = ({
  title,
  imageBackground,
  route,
  searchTerm,
  height = 200,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (searchTerm) {
      router.push({
        pathname: route as any,
        params: { searchTermParam: searchTerm },
      });
    } else {
      router.push(route);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { height }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <ImageBackground source={imageBackground} style={styles.imageBackground} resizeMode="cover">
        <BlurView intensity={0} style={styles.blurView}>
          <Text style={styles.title}>{title}</Text>
        </BlurView>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
});

export default ImageNavigationCard;
