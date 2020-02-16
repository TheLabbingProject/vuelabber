import Vue from 'vue'
import { titlesDictionary } from '@/utils'

Vue.filter('formatResearcherName', researcher => {
  if (researcher) {
    let title = titlesDictionary[researcher.profile['title']]
    return researcher.firstName && researcher.lastName ? title
      ? `${title} ${researcher.firstName} ${researcher.lastName}`
      : `${researcher.firstName} ${researcher.lastName}` : researcher.username
  }
})
