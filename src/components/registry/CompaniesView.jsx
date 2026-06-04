import RegistryView from './RegistryView.jsx'
import { uid } from '../../data/model.js'

const TYPES = ['client', 'our', 'partner']

const columns = [
  { key: 'name', label: 'Название', type: 'text', width: '1.8fr' },
  { key: 'type', label: 'Тип', type: 'select', options: TYPES, width: '0.8fr' },
  { key: 'inn', label: 'ИНН', type: 'text', width: '1fr' },
  { key: 'kpp', label: 'КПП', type: 'text', width: '1fr' },
  { key: 'phone', label: 'Телефон', type: 'text', width: '1fr' },
  { key: 'address', label: 'Адрес', type: 'text', width: '1.8fr' },
]

export default function CompaniesView() {
  return (
    <RegistryView
      title="Компании"
      subtitle="Заказчики, наше ЮЛ, партнёры"
      coll="companies"
      columns={columns}
      searchKeys={['name', 'inn', 'phone', 'address']}
      makeNew={() => ({ id: uid('co'), name: 'Новая компания', type: 'client', inn: '', kpp: '', phone: '', email: '', address: '' })}
    />
  )
}
