
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
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

  const submit = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password) return Alert.alert('Error', 'Por favor completa todos los campos');

    setIsSubmitting(true);

    try {
      await createUser({
        email, password, name
      })
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-9 bg-white rounded-lg p-5 mt-5'>


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


      <View className='flex justify-center  flex-row gap-2'>
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