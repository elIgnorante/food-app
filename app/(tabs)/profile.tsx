import { getCurrentUser, signOut } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    const res = await signOut();
    if (res.success) {
      // Refrescar el store para que isAuthenticated pase a false inmediatamente
      await useAuthStore.getState().fetchAuthenticatedUser();
      // Navegar a la pantalla de inicio de sesión
      router.replace("/sign-in");
    } else {
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Image
          source={require("../../assets/images/avatar.png")}
          style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }}
        />
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{user?.name ?? "Usuario"}</Text>
        <Text style={{ color: "#666", marginTop: 4 }}>{user?.email ?? ""}</Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => Alert.alert("Editar perfil", "Funcionalidad no implementada aún.")}
          style={{ padding: 12, backgroundColor: "#f0f0f0", borderRadius: 8, marginBottom: 12 }}
        >
          <Text>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          style={{ padding: 12, backgroundColor: "#ff3b30", borderRadius: 8, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;