import { images } from "@/constants";
import {
  getCurrentUser,
  signOut,
  updateUserProfile,
  uploadUserAvatar,
} from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
};

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
  });

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      setForm({
        name: u?.name ?? "",
        email: u?.email ?? "",
        phone: u?.phone ?? "",
        address1: u?.address1 ?? "",
        address2: u?.address2 ?? "",
      });
      setLoading(false);
    })();
  }, []);

  const hasChanges = useMemo(() => {
    if (!user) return false;

    return (
      form.name !== (user?.name ?? "") ||
      form.email !== (user?.email ?? "") ||
      form.phone !== (user?.phone ?? "") ||
      form.address1 !== (user?.address1 ?? "") ||
      form.address2 !== (user?.address2 ?? "")
    );
  }, [form, user]);

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

  const handleSaveProfile = async () => {
    if (!user?.$id) {
      Alert.alert("Error", "No se pudo identificar el usuario.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateUserProfile(user.$id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address1: form.address1.trim(),
        address2: form.address2.trim(),
      });

      setUser(updated);
      await useAuthStore.getState().fetchAuthenticatedUser();
      Alert.alert("Perfil actualizado", "Tus datos fueron guardados correctamente.");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No pudimos actualizar el perfil. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarCapture = async () => {
    if (!user?.$id) {
      Alert.alert("Error", "No se pudo identificar el usuario.");
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a la cámara para actualizar tu foto de perfil.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    setIsUploadingAvatar(true);
    try {
      const avatarUrl = await uploadUserAvatar(user.$id, {
        uri: asset.uri,
        name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
        size: asset.fileSize ?? null,
      });

      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      await useAuthStore.getState().fetchAuthenticatedUser();
      Alert.alert("Foto actualizada", "Tu foto de perfil fue actualizada.");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "No pudimos actualizar la foto de perfil. Intenta de nuevo.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const renderProfileField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: any,
    keyboardType: "default" | "email-address" | "numeric" | "phone-pad" = "default",
    placeholder?: string,
  ) => (
    <View className="mb-4">
      <Text className="body-medium text-gray-500 mb-2">{label}</Text>
      <View className="flex-row items-center bg-white rounded-3xl border border-primary/20 px-3 py-2 shadow-sm shadow-black/5">
        <View className="profile-field__icon">
          <Image source={icon} className="size-5" resizeMode="contain" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={isEditing}
          keyboardType={keyboardType}
          className="flex-1 base-semibold text-dark-100"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      <ScrollView contentContainerClassName="px-5 pb-10">
        <View className="items-center mt-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAvatarCapture}
            disabled={isUploadingAvatar}
          >
            <View className="profile-avatar">
              <Image
                source={user?.avatar ? { uri: user.avatar } : images.avatar}
                className="size-full rounded-full"
              />
              <View className="profile-edit">
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Image source={images.pencil} className="size-3.5" resizeMode="contain" />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <Text className="h3-bold mt-4 text-dark-100">{user?.name ?? "Usuario"}</Text>
          <Text className="body-regular text-gray-500 mt-1">{user?.email ?? ""}</Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg shadow-black/5 mt-8 p-5">
          {renderProfileField("Nombre completo", form.name, (text) => setForm({ ...form, name: text }), images.person, "default", "Ingresa tu nombre")}
          {renderProfileField("Email", form.email, (text) => setForm({ ...form, email: text }), images.envelope, "email-address", "ejemplo@email.com")}
          {renderProfileField("Teléfono", form.phone, (text) => setForm({ ...form, phone: text }), images.phone, "phone-pad", "+1 555 123 4567")}
          {renderProfileField("Dirección 1 (Casa)", form.address1, (text) => setForm({ ...form, address1: text }), images.home, "default", "Calle principal, número")}
          {renderProfileField("Dirección 2 (Trabajo)", form.address2, (text) => setForm({ ...form, address2: text }), images.location, "default", "Oficina o referencia")}
        </View>

        <View className="mt-6 gap-y-3">
          <TouchableOpacity
            onPress={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            disabled={isSaving || (isEditing && !hasChanges)}
            className="flex-row items-center justify-center bg-primary rounded-full py-3 shadow-md shadow-primary/20"
          >
            {isSaving && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
            <Text className="base-bold text-white">
              {isEditing ? "Guardar cambios" : "Editar perfil"}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              onPress={() => {
                setForm({
                  name: user?.name ?? "",
                  email: user?.email ?? "",
                  phone: user?.phone ?? "",
                  address1: user?.address1 ?? "",
                  address2: user?.address2 ?? "",
                });
                setIsEditing(false);
              }}
              disabled={isSaving}
              className="flex-row items-center justify-center border border-primary rounded-full py-3 bg-white shadow-sm shadow-black/5"
            >
              <Text className="base-bold text-primary">Cancelar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center bg-red-500 rounded-full py-3 shadow-md shadow-red-500/20"
          >
            <Image source={images.logout} className="size-5 mr-2" resizeMode="contain" tintColor="#fff" />
            <Text className="base-bold text-white">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
