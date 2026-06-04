import { useState } from 'react'
import { StoreProvider } from './store/StoreContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import PipelinesView from './components/PipelinesView.jsx'
import ContactsView from './components/registry/ContactsView.jsx'
import CompaniesView from './components/registry/CompaniesView.jsx'
import CampsShiftsView from './components/registry/CampsShiftsView.jsx'
import DocumentsView from './components/registry/DocumentsView.jsx'
import TemplatesView from './components/templates/TemplatesView.jsx'

const VIEWS = {
  pipelines: PipelinesView,
  contacts: ContactsView,
  companies: CompaniesView,
  camps: CampsShiftsView,
  documents: DocumentsView,
  templates: TemplatesView,
}

export default function App() {
  const [view, setView] = useState('pipelines')
  const View = VIEWS[view] || PipelinesView

  return (
    <StoreProvider>
      <div className="flex h-screen min-h-[100dvh] overflow-hidden bg-canvas">
        <Sidebar view={view} setView={setView} />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <View />
        </main>
      </div>
    </StoreProvider>
  )
}
