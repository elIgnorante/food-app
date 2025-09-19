import { images } from "@/constants";
import { Redirect, Slot } from "expo-router";
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function _Layout() {
  const isAuthenticated  = false;

  if (isAuthenticated) return <Redirect href="/" />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.25 }}>
            <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg" resizeMode="stretch" />
            <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10" />
          </View>
          <Slot />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}