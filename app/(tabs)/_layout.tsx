import { Redirect, Slot } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function _Layout() {
  const isAuthenticated = false;
  if (!isAuthenticated) { return <Redirect href="/sign-in" />; }

  return (
      <SafeAreaView>
        <Text>_layout tab</Text>
        <Slot />
      </SafeAreaView>
    )
}