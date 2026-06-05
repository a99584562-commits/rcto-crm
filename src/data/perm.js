// Простая ролевая модель прав.
export const ROLES = ['admin', 'manager', 'viewer']
export const ROLE_LABELS = { admin: 'Администратор', manager: 'Менеджер', viewer: 'Наблюдатель' }
export const ROLE_COLORS = { admin: '#1f47f5', manager: '#0ea5a3', viewer: '#838ca0' }
export const ROLE_HINT = {
  admin: 'Полный доступ: сделки, реестры, управление пользователями.',
  manager: 'Редактирует сделки и реестры. Без управления пользователями.',
  viewer: 'Только просмотр — изменения недоступны.',
}

export function currentUser(state) {
  return state.users?.find((u) => u.id === state.currentUserId) || state.users?.[0] || null
}
export function canEdit(state) {
  const u = currentUser(state)
  return !!u && u.role !== 'viewer'
}
export function canManageUsers(state) {
  return currentUser(state)?.role === 'admin'
}
