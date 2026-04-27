import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Phone, Mail, Edit2, Trash2, User, Star, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../../../store/authstores'
import toast from 'react-hot-toast'

export default function EmergencyContacts() {
    const { userData, updateUserData } = useAuthStore()
    const [contacts, setContacts] = useState(userData?.emergencyContacts || [])
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingContact, setEditingContact] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        relationship: '',
        isPrimary: false,
    })

    const handleSaveContact = async () => {
        if (!formData.name || !formData.phone) {
            toast.error('Please fill in name and phone number')
            return
        }

        let newContacts
        if (editingContact) {
            newContacts = contacts.map(c =>
                c.id === editingContact.id ? { ...formData, id: c.id } : c
            )
        } else {
            newContacts = [...contacts, { ...formData, id: Date.now().toString() }]
        }

        setContacts(newContacts)
        await updateUserData({ emergencyContacts: newContacts })

        toast.success(editingContact ? 'Contact updated' : 'Contact added')
        setShowAddModal(false)
        setEditingContact(null)
        setFormData({ name: '', phone: '', email: '', relationship: '', isPrimary: false })
    }

    const handleDeleteContact = async (contactId) => {
        const newContacts = contacts.filter(c => c.id !== contactId)
        setContacts(newContacts)
        await updateUserData({ emergencyContacts: newContacts })
        toast.success('Contact removed')
    }

    const handleSetPrimary = async (contactId) => {
        const newContacts = contacts.map(c => ({
            ...c,
            isPrimary: c.id === contactId
        }))
        setContacts(newContacts)
        await updateUserData({ emergencyContacts: newContacts })
        toast.success('Primary contact updated')
    }

    const handleEditContact = (contact) => {
        setEditingContact(contact)
        setFormData({
            name: contact.name,
            phone: contact.phone,
            email: contact.email || '',
            relationship: contact.relationship || '',
            isPrimary: contact.isPrimary || false,
        })
        setShowAddModal(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
                    <p className="text-sm text-gray-600">These contacts will be notified during SOS alerts</p>
                </div>
                <button
                    onClick={() => {
                        setEditingContact(null)
                        setFormData({ name: '', phone: '', email: '', relationship: '', isPrimary: false })
                        setShowAddModal(true)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    <Plus size={18} />
                    <span>Add Contact</span>
                </button>
            </div>

            {contacts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <User size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No emergency contacts added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add contacts to receive SOS alerts</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {contacts.map((contact, index) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white border rounded-xl p-4 hover:shadow-md transition ${contact.isPrimary ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                            <User size={20} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                                                {contact.isPrimary && (
                                                    <span className="px-2 py-0.5 bg-primary-200 text-primary-800 text-xs rounded-full">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{contact.relationship || 'Contact'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-2 ml-12">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Phone size={14} className="text-gray-400" />
                                            <a href={`tel:${contact.phone}`} className="text-gray-700 hover:text-primary-600">
                                                {contact.phone}
                                            </a>
                                        </div>
                                        {contact.email && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Mail size={14} className="text-gray-400" />
                                                <a href={`mailto:${contact.email}`} className="text-gray-700 hover:text-primary-600">
                                                    {contact.email}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    {!contact.isPrimary && (
                                        <button
                                            onClick={() => handleSetPrimary(contact.id)}
                                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                            title="Set as primary"
                                        >
                                            <Star size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditContact(contact)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteContact(contact.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                <select
                                    value={formData.relationship}
                                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Select relationship</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Friend">Friend</option>
                                    <option value="Relative">Relative</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPrimary}
                                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                                    className="rounded text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">Set as primary contact</span>
                            </label>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddModal(false)
                                    setEditingContact(null)
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveContact}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                {editingContact ? 'Update' : 'Add'} Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

