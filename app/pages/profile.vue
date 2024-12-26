<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-2">My Profile</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-8">
      Updating your personal information does not affect your billing account information.
      <NuxtLink to="/billing" class="text-primary hover:underline">Manage billing information</NuxtLink>
    </p>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-8">
      <h2 class="text-xl font-semibold mb-6">Your Profile</h2>
      
      <div v-if="profileImage" class="mb-6">
        <div class="relative w-32 h-32 mb-2">
          <img 
            :src="profileImage || '/default-avatar.png'" 
            class="rounded-full w-full h-full object-cover bg-gray-100 dark:bg-gray-700"
            alt="Profile photo"
          >
          <button 
            class="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"
            @click="triggerImageUpload"
          >
            <Icon name="uil:camera" class="w-5 h-5" />
          </button>
          <input 
            ref="fileInput" 
            type="file" 
            class="hidden" 
            accept="image/*"
            @change="handleImageUpload"
          >
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This optional photo will be visible to your coworkers when they access your signature invitations.
          Minimum size 200x200px, maximum 500 KB.
        </p>
        <button 
          v-if="profileImage"
          class="text-primary hover:underline text-sm mt-1" 
          @click="removeImage"
        >
          Remove image
        </button>
      </div>

      <div class="flex flex-col gap-16">
        <UForm 
          :state="profile" 
          class="space-y-6" 
          @submit="saveChanges">
          <div class="flex flex-row gap-4">
            <UFormField label="First Name" class="w-full">
              <UInput v-model="profile.firstName" trailing-icon="i-lucide-user" placeholder="Enter your first name" class="w-full"/>
            </UFormField>
            <UFormField label="Last Name" class="w-full">
              <UInput v-model="profile.lastName" trailing-icon="i-lucide-user" placeholder="Enter your last name" class="w-full"/>
            </UFormField>
          </div>
          <div class="flex flex-row gap-4">
            <UFormField label="Email" class="w-full">
              <UInput v-model="profile.email" trailing-icon="i-lucide-at-sign" placeholder="Enter your email" class="w-full"/>
            </UFormField>
            <UFormField label="Phone Number (optional)" class="w-full">
              <UInput v-model="profile.phone" trailing-icon="i-lucide-phone" placeholder="Enter your phone number" class="w-full"/>
            </UFormField>
          </div>
        </UForm>

        <h2 class="text-xl font-semibold">Additional informations</h2>

        <UForm 
          :state="address" 
          class="flex flex-col gap-4"
          @submit="saveChanges">

          <UInput v-model="address.line1" placeholder="Line 1" class="w-full"/>
          <UInput v-model="address.line2" placeholder="Line 2" class="w-full"/>
          <UInput v-model="address.city" placeholder="City" class="w-full"/>
          <UInput v-model="address.zip" placeholder="Zip" class="w-full"/>
          <UInput v-model="address.country" placeholder="Country" class="w-full"/>

        </UForm>

        <UForm 
          :state="profile" 
          class="flex flex-col gap-4"
          @submit="saveChanges">

            <UFormField label="Birth Date" class="w-full">
              <UInput v-model="profile.birthDate" trailing-icon="i-lucide-calendar" placeholder="Enter your birth date" class="w-full"/>
            </UFormField>

            <UFormField label="Birth Place" class="w-full">
              <UInput v-model="profile.birthPlace" trailing-icon="i-lucide-map-pin" placeholder="Enter your birth place" class="w-full"/>
            </UFormField>

            <UFormField label="Nationality" class="w-full">
              <UInput v-model="profile.nationality" trailing-icon="i-lucide-flag" placeholder="Enter your nationality" class="w-full"/>
            </UFormField>

        </UForm>
      </div>

      
      <div class="flex justify-end mt-16">
        <UButton @click="saveChanges">Save Changes</UButton>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Organisations</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Regular password changes help enhance your account security.
      </p>
      <button 
        class="text-primary hover:underline"
        @click="changePassword"
      >
        Change password
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Password</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Regular password changes help enhance your account security.
      </p>
      <button 
        class="text-primary hover:underline"
        @click="changePassword"
      >
        Change password
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { getUser, getUserInfo, updateUser } from '../services/user-service'
import { getAddressForUser } from '~/services/address-service'
const user = useSupabaseUser()

definePageMeta({
  layout: 'dashboard'
})

const fileInput = ref<HTMLInputElement | null>(null)
const profileImage = ref<string | null>(null)

const profile = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneCountry: 'FR',
  birthDate: '',
  birthPlace: '',
  nationality: ''
})

const address = reactive({
  line1: '',
  line2: '',
  city: '',
  zip: '',
  country: ''
})

function triggerImageUpload() {
  fileInput.value?.click()
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // TODO: Implement image upload logic
    profileImage.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  profileImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function saveChanges() {
  try {
    await updateUser({
      id: user.value?.id ?? '',
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      avatarUrl: profileImage.value
    })
    
    
    const toast = useToast()
    toast.add({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
      color: 'success'
    })
  } catch (error) {
    console.error('Error saving profile:', error)
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to update profile. Please try again.',
      color: 'error'
    })
  }
}

function changePassword() {
  // TODO: Implement password change logic
  console.log('Change password clicked')
}

onMounted(async () => {
    const user = await getUser(useSupabaseUser().value)
    
    if (!user.firstName && !user.lastName && user.fullName) {
        profile.firstName = user.fullName.split(' ')[0] ?? ''
        profile.lastName = user.fullName.split(' ')[1] ?? ''
    } else {
        profile.firstName = user.firstName ?? ''
        profile.lastName = user.lastName ?? ''
    }
    profileImage.value = user.avatarUrl || null
    profile.email = user.email
    profile.phone = user.phone ?? ''

    const userAddress = getAddressForUser(user)
    if (userAddress) {
        address.line1 = userAddress.line1 ?? ''
        address.line2 = userAddress.line2 ?? ''
        address.city = userAddress.city ?? ''
        address.zip = userAddress.zip ?? ''
        address.country = userAddress.country ?? ''
    }

    const userInfo = getUserInfo(user)
    console.log(userInfo)
    if (userInfo) {
        profile.birthDate = userInfo.birthDate.toString()
        profile.birthPlace = userInfo.birthPlace
        profile.nationality = userInfo.nationality
    }
})
</script>

<style>

</style>