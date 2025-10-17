import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPrivacy, setShowPrivacy] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const submit = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password)
      return Alert.alert('Error', 'Por favor completa todos los campos');

    setIsSubmitting(true);
    try {
      await createUser({ email, password, name });
      // Refresca el estado de autenticación en el store antes de navegar
      await useAuthStore.getState().fetchAuthenticatedUser();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className='gap-9 bg-white rounded-lg p-5 mt-5'>
      {/* Modal del Aviso de Privacidad */}
      <Modal visible={showPrivacy} transparent animationType='slide'>
        <View className='flex-1 justify-center items-center bg-black/60'>
          <View className='bg-white rounded-xl p-5 w-11/12 max-h-[80%]'>
            <ScrollView>
              <Text className='text-xl font-bold mb-3 text-center'>
                Aviso de Privacidad
              </Text>
              <Text className='text-gray-700 text-justify mb-4'>
                En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, informamos que los datos personales que proporciones a través de esta aplicación serán utilizados exclusivamente para crear y administrar tu cuenta de usuario, autenticar tu acceso y ofrecerte los servicios de la plataforma.{"\n\n"}
                La información es almacenada y gestionada de manera segura a través del servicio Appwrite, proveedor de infraestructura tecnológica que cumple con altos estándares de seguridad y confidencialidad.{"\n\n"}
                No compartimos tus datos personales con terceros, salvo requerimiento legal o autorización expresa de tu parte.{"\n\n"}
                Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición (ARCO) comunicándote a través de los medios de contacto indicados en nuestra aplicación o sitio web.{"\n\n"}
                Al marcar la casilla de aceptación, declaras haber leído y comprendido este aviso y otorgas tu consentimiento para el tratamiento de tus datos conforme a los fines antes mencionados.
              </Text>


              {/* Checkbox personalizado */}
              <Pressable
                onPress={() => setIsChecked(!isChecked)}
                className='flex-row items-center mb-3'
              >
                <View
                  className={`w-5 h-5 border-2 rounded-md mr-2 ${isChecked ? 'bg-orange-500 border-blue-600' : 'border-gray-400'}`}
                >
                  {isChecked && (
                    <Text className='text-white text-center font-bold'>✓</Text>
                  )}
                </View>
                <Text>He leído y acepto el aviso de privacidad</Text>
              </Pressable>

              <Pressable
                disabled={!isChecked}
                onPress={() => setShowPrivacy(false)}
                className={`rounded-lg p-3 ${isChecked ? 'bg-orange-500' : 'bg-gray-400'}`}
              >
                <Text className='text-white text-center font-bold'>
                  {isChecked ? 'Aceptar' : 'Marca la casilla para continuar'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Formulario de registro */}
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
        secureTextEntry
      />
      <CustomButton
        title='Registrate'
        onPress={submit}
        isLoading={isSubmitting}
      />

      <View className='flex justify-center flex-row gap-2'>
        <Text className='base-regular text-gray-100'>¿Ya tienes una cuenta?</Text>
        <Link href={'/sign-in'} className='base-bold text-primary'>
          Inicia Sesión
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
