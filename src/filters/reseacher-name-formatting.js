import Vue from 'vue'
import { titlesDictionary } from '@/utils'

Vue.filter('formatResearcherName', researcher => {
  if (researcher) {
    let title = titlesDictionary[researcher.title]
    return title
      ? `${title} ${researcher.firstName} ${researcher.lastName}`
      : `${researcher.firstName} ${researcher.lastName}`
  }
})
