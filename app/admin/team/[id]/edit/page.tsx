import EditTeamForm from './EditTeamForm'

export async function generateStaticParams() {
  return []
}

export const dynamicParams = false

export default function EditTeamMemberPage() {
  return <EditTeamForm />
}
