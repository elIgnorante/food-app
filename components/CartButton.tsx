import { Text, TouchableOpacity, View } from "react-native";


export const CartButton = () => {
  const totalItems = 10;

  return (
    <TouchableOpacity className="cart-btn" onPress={()=>{}}>
        {totalItems > 0 && (
            <View className="cart-badge">
                <Text className="small-bold text-white">
                    {totalItems}
                </Text>
            </View>)}
    </TouchableOpacity>
  )
}
