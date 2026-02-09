import { getTeamMembers } from '@/lib/content'
import { SiteLayout } from '@/components/layout/SiteLayout'
import TeamPageClient from './TeamPageClient'

export default async function TeamPage() {
  const team = await getTeamMembers()

  return (
    <SiteLayout>
      <TeamPageClient team={team} />
    </SiteLayout>
  )
}
