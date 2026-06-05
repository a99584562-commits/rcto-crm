import { useState } from 'react'
import { StoreProvider, useStore } from './store/StoreContext.jsx'
import { canManageUsers } from './data/perm.js'
import Sidebar from './components/Sidebar.jsx'
import PipelinesView from './components/PipelinesView.jsx'
import ChatView from './components/chat/ChatView.jsx'
import ContactsView from './components/registry/ContactsView.jsx'
import CompaniesView from './components/registry/CompaniesView.jsx'
import CampsShiftsView from './components/registry/CampsShiftsView.jsx'
import DocumentsView from './components/registry/DocumentsView.jsx'
import TemplatesView from './components/templates/TemplatesView.jsx'
import UsersView from './components/registry/UsersView.jsx'

const VIEWS = {
  pipelines: PipelinesView,
  chats: ChatView,
  contacts: ContactsView,
  companies: CompaniesView,
  camps: CampsShiftsView,
  documents: DocumentsView,
  templates: TemplatesView,
  users: UsersView,
}

function Shell() {
  const { state } = useStore()
  const [view, setView] = useState('pipelines')
  const allowed = view !== 'users' || canManageUsers(state)
  const View = VIEWS[allowed ? view : 'pipelines'] || PipelinesView

  return (
    <div className="flex h-screen min-h-[100dvh] overflow-hidden bg-canvas">
      <Sidebar view={view} setView={setView} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <View />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
