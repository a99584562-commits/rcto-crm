import RegistryView from './RegistryView.jsx'
import { uid } from '../../data/model.js'

const ROLES = ['Мать', 'Отец', 'Опекун', 'Преподаватель', 'Контактное лицо', 'Бухгалтер', 'Руководитель', 'Сопровождающий', 'Контакт']

const columns = [
  { key: 'fullName', label: 'ФИО', type: 'text', width: '1.6fr' },
  { key: 'role', label: 'Роль', type: 'select', options: ROLES, width: '1fr' },
  { key: 'phone', label: 'Телефон', type: 'text', width: '1fr' },
  { key: 'email', label: 'E-mail', type: 'text', width: '1.2fr' },
  { key: 'companyId', label: 'Компания', type: 'company', width: '1.4fr' },
]

export default function ContactsView() {
  return (
    <RegistryView
      title="Контакты"
      subtitle="Родители, преподаватели, контактные лица"
      coll="contacts"
      columns={columns}
      searchKeys={['fullName', 'phone', 'email', 'role']}
      makeNew={() => ({ id: uid('ct'), fullName: 'Новый контакт', role: 'Контакт', phone: '', email: '', companyId: null })}
    />
  )
}
