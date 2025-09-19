
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const submit = () => {
    if (!form.name || !form.email || !form.password) return Alert.alert('Error', 'Por favor completa todos los campos');

    setIsSubmitting(true);

    try {
      // TODO: call api sign up

      Alert.alert('Success', 'Registro exitoso');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>


      <CustomInput
        placeholder='Ingresa tu nombre'
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label='Nombre Completo'
      />
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
        title='Registrate'
        onPress={submit}
        isLoading={isSubmitting}
      />


      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className="base-regular text-gray-100">
          ¿Ya tienes una cuenta?
        </Text>
        <Link href={'/sign-in'} className='base-bold text-primary'>
          Inicia Sesión
        </Link>
      </View>
    </View>
  )
}

export default SignUp