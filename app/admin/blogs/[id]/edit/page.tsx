import EditBlogForm from './EditBlogForm'

// Required for static export - returns empty array (admin pages won't work on static hosting)
export async function generateStaticParams() {
  return []
}

// Disable dynamic params - only statically generated pages work
export const dynamicParams = false

export default function EditBlogPage() {
  return <EditBlogForm />
}
