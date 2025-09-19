import { CartButton } from "@/components/CartButton";
import { images, offers } from "@/constants";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">

      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                className={`offer-card ${isEven ? 'flex-row-reverse' : 'flex-row'}`}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: '#FFFF22' }}
              >
                {({ pressed }) => (
                  <Fragment>
                    <View className={"h-full w-1/2"}>
                      <Image source={item.image} className={"size-full"} resizeMode={"contain"} />
                    </View>

                    <View className={`offer-card__info ${isEven ? 'pl-10' : 'pr-10'}`} >
                      <Text className="h1-bold text-white lending-tight">
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor={"#FFFFFF"}
                      />
                    </View>

                  </Fragment>
                )}
              </Pressable>
            </View>
          )
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-fulll my-5">
            <View className="flex-start">
              <Text className="small-bold text-primary">ENTREGAR A</Text>
              <TouchableOpacity>
                <Text className="paragraph-bold text-dark-100">México</Text>
                <Image className="size-3" source={images.arrowDown} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            <CartButton />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
