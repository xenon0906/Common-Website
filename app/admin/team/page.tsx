'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  getFirebaseDb,
  getAppId,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from '@/lib/firebase'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Mail,
  Linkedin,
  GripVertical,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  bio: string | null
  details: string | null
  imageUrl: string | null
  portraitUrl: string | null
  email: string | null
  linkedin: string | null
  twitter: string | null
  order: number
  isActive: boolean
  createdAt?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const teamRef = collection(db, 'artifacts', appId, 'public', 'data', 'team')
      const querySnapshot = await getDocs(teamRef)

      const members: TeamMember[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        name: '',
        bio: null,
        details: null,
        imageUrl: null,
        portraitUrl: null,
        email: null,
        linkedin: null,
        twitter: null,
        order: 0,
        isActive: true,
        ...docSnap.data()
      }))

      // Sort by order
      members.sort((a, b) => (a.order || 0) - (b.order || 0))
      setTeamMembers(members)
    } catch (error) {
      console.error('Error fetching team members:', error)
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = (teamMembers || []).filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.details && member.details.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'team', id))
      setTeamMembers(teamMembers.filter((m) => m.id !== id))
    } catch (error) {
      console.error('Error deleting team member:', error)
      alert('Failed to delete team member')
    }
  }

  const toggleActive = async (member: TeamMember) => {
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const memberRef = doc(db, 'artifacts', appId, 'public', 'data', 'team', member.id)
      await updateDoc(memberRef, { isActive: !member.isActive })
      setTeamMembers(teamMembers.map((m) =>
        m.id === member.id ? { ...m, isActive: !m.isActive } : m
      ))
    } catch (error) {
      console.error('Error toggling team member status:', error)
      alert('Failed to update team member status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Manager</h1>
          <p className="text-muted-foreground">Manage your team members (Firestore)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTeamMembers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/admin/team/create">
              <Plus className="w-5 h-5 mr-2" />
              Add Team Member
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Team Member List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="space-y-4">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-md transition-shadow ${!member.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left side - Avatar and info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="hidden md:flex items-center text-muted-foreground cursor-grab">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center flex-shrink-0">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {getInitials(member.name)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{member.name}</h3>
                          {!member.isActive && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                          {member.portraitUrl && (
                            <Badge variant="outline" className="text-xs text-green-600">Has Portrait</Badge>
                          )}
                        </div>
                        {member.details && (
                          <p className="text-sm text-muted-foreground truncate">{member.details}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {member.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </span>
                          )}
                          {member.linkedin && (
                            <span className="flex items-center gap-1">
                              <Linkedin className="w-3 h-3" />
                              LinkedIn
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Order: {member.order}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(member)}
                        title={member.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {member.isActive ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/team/${member.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No team members found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'No members match your search.' : 'Get started by adding your first team member.'}
            </p>
            <Button variant="gradient" asChild>
              <Link href="/admin/team/create">
                <Plus className="w-5 h-5 mr-2" />
                Add Team Member
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
