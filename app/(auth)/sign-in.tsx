
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const submit = () => {
    if (!form.email || !form.password) return Alert.alert('Error', 'Por favor completa todos los campos');

    setIsSubmitting(true);

    try {
      // TODO: call api

      Alert.alert('Success', 'Sesión iniciada correctamente');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>

      <CustomInput
        placeholder='Ingresa tu email'
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label='Email'
        keyboardType='email-address'
      />
      <CustomInput
        placeholder='Ingresa tu contraseña'
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        label='Contraseña'
        secureTextEntry={true}
      />
      <CustomButton
        title='Iniciar Sesión'
        onPress={submit}
        isLoading={isSubmitting}
      />


      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className="base-regular text-gray-100">
          ¿No tienes una cuenta?
        </Text>
        <Link href={'/sign-up'} className='base-bold text-primary'>
          Regístrate
        </Link>
      </View>
    </View>
  )
}

export default SignIn