import { useState, useRef } from 'react'
import { useAuthStore } from '../../store/authstores'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebases'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    IdentificationIcon,
    CameraIcon,
    PencilIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user, updateUser } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileImage, setProfileImage] = useState(user?.photoURL || null)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        dob: user?.dob || '',
        aadhar: user?.aadhar || '',
        emergencyContact: user?.emergencyContact || '',
        emergencyPhone: user?.emergencyPhone || ''
    })

    const fileInputRef = useRef(null)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        const reader = new FileReader()
        reader.onload = async (e) => {
            setProfileImage(e.target.result)

            // Upload to Firebase
            try {
                const storageRef = ref(storage, `profiles/${user?.uid}`)
                await uploadString(storageRef, e.target.result, 'data_url')
                const photoURL = await getDownloadURL(storageRef)

                await updateDoc(doc(db, 'users', user?.uid), { photoURL })
                updateUser({ ...user, photoURL })

                toast.success('Profile picture updated')
            } catch (error) {
                toast.error('Failed to upload image')
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        setLoading(true)

        try {
            await updateDoc(doc(db, 'users', user?.uid), formData)
            updateUser({ ...user, ...formData })
            setIsEditing(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            pincode: user?.pincode || '',
            dob: user?.dob || '',
            aadhar: user?.aadhar || '',
            emergencyContact: user?.emergencyContact || '',
            emergencyPhone: user?.emergencyPhone || ''
        })
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    👤 Profile
                </h1>
                <p className="text-gray-600 mt-1">
                    Manage your personal information and preferences
                </p>
            </div>

            {/* Profile Card */}
            <Card>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-1">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <UserIcon className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                            >
                                <CameraIcon className="w-4 h-4" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                            <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                                Verified Account
                            </span>
                            <span className="px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-xs font-medium">
                                Premium
                            </span>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Personal Information</h3>
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        <XMarkIcon className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleSave}
                                        loading={loading}
                                    >
                                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                icon={<UserIcon className="w-5 h-5" />}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                icon={<EnvelopeIcon className="w-5 h-5" />}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                icon={<PhoneIcon className="w-5 h-5" />}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                icon={<CalendarIcon className="w-5 h-5" />}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Aadhar Number"
                                value={formData.aadhar}
                                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                                icon={<IdentificationIcon className="w-5 h-5" />}
                                disabled={!isEditing}
                                className="col-span-2"
                            />

                            <Input
                                label="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                icon={<MapPinIcon className="w-5 h-5" />}
                                disabled={!isEditing}
                                className="col-span-2"
                            />

                            <Input
                                label="City"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                disabled={!isEditing}
                            />

                            <Input
                                label="State"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Pincode"
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Emergency Contact */}
            <Card>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Contact Name"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        icon={<UserIcon className="w-5 h-5" />}
                        disabled={!isEditing}
                    />

                    <Input
                        label="Contact Phone"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                        icon={<PhoneIcon className="w-5 h-5" />}
                        disabled={!isEditing}
                    />
                </div>
            </Card>

            {/* Account Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600">25</div>
                    <div className="text-xs text-gray-500">Photos</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600">12</div>
                    <div className="text-xs text-gray-500">Documents</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600">8</div>
                    <div className="text-xs text-gray-500">Reports</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600">3</div>
                    <div className="text-xs text-gray-500">Contacts</div>
                </Card>
            </div>

            {/* Account Actions */}
            <Card className="bg-primary-50 border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Account Actions</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button className="p-3 bg-white rounded-lg text-left hover:shadow-md transition-shadow">
                        <p className="font-medium text-gray-800">Change Password</p>
                        <p className="text-xs text-gray-500">Update your password</p>
                    </button>

                    <button className="p-3 bg-white rounded-lg text-left hover:shadow-md transition-shadow">
                        <p className="font-medium text-gray-800">Two-Factor Auth</p>
                        <p className="text-xs text-gray-500">Enhance account security</p>
                    </button>

                    <button className="p-3 bg-white rounded-lg text-left hover:shadow-md transition-shadow">
                        <p className="font-medium text-danger">Delete Account</p>
                        <p className="text-xs text-gray-500">Permanently delete account</p>
                    </button>
                </div>
            </Card>
        </div>
    )
}

export default Profile





