import Vue from 'vue'
import { titlesDictionary } from '@/utils'

Vue.filter('formatResearcherName', researcher => {
  if (researcher) {
    let title = titlesDictionary[researcher.profile['title']]
    let fullName = `${researcher.firstName} ${researcher.lastName}`
    return researcher.firstName && researcher.lastName
      ? title
        ? `${title} ${fullName}`
        : `${fullName}`
      : researcher.username
  }
})
