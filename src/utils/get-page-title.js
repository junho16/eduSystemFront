import defaultSettings from '@/settings'

// const title = defaultSettings.title || 'Vue Element Admin'
const title = defaultSettings.title || '教学质量管理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
