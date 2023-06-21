import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'
const messages = {
  en: {
    ...en
  },
  zh: {
    ...zh
  }
}

const getCurrentLanguage = () => {
  const UAlang = navigator.language.split('-')[0] // zh-CN--->zh
  const curLang = localStorage.getItem('lang') || null
  const langArr = Object.keys(messages)
  let langCode = 'zh'
  curLang
    ? (langCode = curLang)
    : langArr.includes(UAlang) && (langCode = UAlang)
  localStorage.setItem('lang', langCode)
  return langCode
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getCurrentLanguage() || 'zh',
  messages: messages
})

export default i18n
