import session from '@/api/session'
import {
  DATA_ACQUISITIONS,
  EXPORT_SUBJECT_DATA,
  EVENTS,
  GROUPS,
  MEASUREMENT_DEFINITIONS,
  PROCEDURE_STEPS,
  PROCEDURES,
  STUDIES,
  SUBJECTS
} from '@/api/research/endpoints'
import {
  getDataAcquisitionQueryString,
  getEventQueryString,
  getGroupQueryString,
  getProcedureQueryString,
  getProcedureStepQueryString,
  getStudyQueryString,
  getSubjectQueryString
} from '@/api/research/query'

const state = {
  studies: [],
  groups: [],
  groupCount: 0,
  subjects: [],
  plots: { subject: {} },
  subjectCount: 0,
  studyCount: 0,
  procedures: [],
  procedureCount: 0,
  events: [],
  eventCount: 0,
  eventItems: [],
  procedureSteps: [],
  procedureStepCount: 0,
  procedureItems: [],
  measurementDefinitions: [],
  dataAcquisitionModels: []
}

const getters = {
  getGroupById(state) {
    return groupId => state.groups.find(group => group.id === groupId)
  },
  getSubjectById(state) {
    return id => state.subjects.find(subject => subject.id === id)
  },
  getSubjectByUrl(state) {
    return url => state.subjects.find(subject => subject.url === url)
  }
}

const mutations = {
  setStudies(state, studies) {
    state.studies = studies
  },
  setProcedures(state, procedures) {
    state.procedures = procedures
  },
  setProcedureItems(state, procedureItems) {
    state.procedureItems = procedureItems
  },
  setMeasurementDefinitions(state, measurementDefinitions) {
    state.measurementDefinitions = measurementDefinitions
  },
  setEventItems(state, eventItems) {
    state.eventItems = eventItems
  },
  setProcedureSteps(state, procedureSteps) {
    state.procedureSteps = procedureSteps
  },
  setSubjects(state, subjects) {
    state.subjects = subjects
  },
  setEvents(state, events) {
    state.events = events
  },
  addSubject(state, subject) {
    state.subjects.push(subject)
  },
  addEvent(state, event) {
    state.events.push(event)
  },
  setGroups(state, groups) {
    state.groups = groups
  },
  setGroupCount(state, groupCount) {
    state.groupCount = groupCount
  },
  setDataAcquisitionModels(state, dataAcquisitionModels) {
    state.dataAcquisitionModels = dataAcquisitionModels
  },
  addStudy(state, study) {
    state.studies.push(study)
  },
  addProcedure(state, procedure) {
    state.procedures.push(procedure)
  },
  addProcedureStep(state, procedureStep) {
    state.procedureSteps.push(procedureStep)
  },
  updateStudyState(state, updatedStudy) {
    let index = state.studies.indexOf(
      state.studies.find(study => study.id === updatedStudy.id)
    )
    // Mutating an array directly causes reactivity problems
    let newStudies = state.studies.slice()
    newStudies[index] = updatedStudy
    state.studies = newStudies
  },
  updateProcedureState(state, updatedProcedure) {
    let index = state.procedures.indexOf(
      state.procedures.find(procedure => procedure.id === updatedProcedure.id)
    )
    // Mutating an array directly causes reactivity problems
    let newProcedures = state.procedures.slice()
    newProcedures[index] = updatedProcedure
    state.procedures = newProcedures
  },
  updateProcedureStepState(state, updatedProcedureStep) {
    let index = state.procedureSteps.indexOf(
      state.procedureSteps.find(
        procedureStep => procedureStep.id === updatedProcedureStep.id
      )
    )
    // Mutating an array directly causes reactivity problems
    let newProcedureSteps = state.procedureSteps.slice()
    newProcedureSteps[index] = updatedProcedureStep
    state.procedureSteps = newProcedureSteps
  },
  updateEventState(state, updatedEvent) {
    let index = state.procedureSteps.indexOf(
      state.procedureSteps.find(
        procedureStep => procedureStep.event === updatedEvent.id
      )
    )
    // Mutating an array directly causes reactivity problems
    let newProcedureSteps = state.procedureSteps.slice()
    newProcedureSteps[index] = Object.assign(state.procedureSteps[index], {
      event: updatedEvent.id,
      eventInfo: updatedEvent
    })
    state.procedureSteps = newProcedureSteps

    let eventIndex = state.events.indexOf(
      state.events.find(event => event.id === updatedEvent.id)
    )
    // Mutating an array directly causes reactivity problems
    let newEvents = state.events.slice()
    newEvents[eventIndex] = updatedEvent
    state.events = newEvents
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  updateSubjectState(state, updatedSubject) {
    let index = state.subjects.indexOf(
      state.subjects.find(subject => subject.id === updatedSubject.id)
    )
    // Mutating an array directly causes reactivity problems
    let newSubjects = state.subjects.slice()
    newSubjects[index] = updatedSubject
    state.subjects = newSubjects
  },
  removeSubjectFromState(state, subject) {
    state.subjects = state.subjects.filter(
      existingSubject => existingSubject.id != subject.id
    )
  },
  removeStudyFromState(state, study) {
    state.studies = state.studies.filter(
      existingStudy => existingStudy.id != study.id
    )
  },
  removeGroupFromState(state, group) {
    state.groups = state.groups.filter(
      existingGroup => existingGroup.id != group.id
    )
  },
  removeProcedureFromState(state, procedure) {
    state.procedures = state.procedures.filter(
      existingProcedure => existingProcedure.id != procedure.id
    )
  },
  removeProcedureStepFromState(state, procedureStep) {
    state.procedureSteps = state.procedureSteps.filter(
      existingProcedureStep => existingProcedureStep.id != procedureStep.id
    )
  },
  removeEventFromState(state, event) {
    state.events = state.events.filter(
      existingEvent => existingEvent.id != event.id
    )
  },
  setSubjectDateOfBirthPlot(state, script) {
    var plots = Object.assign({}, state.plots)
    plots.subject.dateOfBirth = script
    state.plots = plots
  },
  setSubjectCount(state, count) {
    state.subjectCount = count
  },
  setStudyCount(state, count) {
    state.studyCount = count
  },
  setProcedureCount(state, count) {
    state.procedureCount = count
  },
  setProcedureStepCount(state, count) {
    state.procedureStepCount = count
  },
  setEventCount(state, count) {
    state.eventCount = count
  }
}

const actions = {
  fetchStudies({ commit }, query) {
    let queryString = getStudyQueryString(query)
    let URL = `${STUDIES}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setStudies', data.results)
        commit('setStudyCount', data.count)
      })
      .catch(console.error)
  },
  fetchProcedures({ commit }, query) {
    let queryString = getProcedureQueryString(query)
    let URL = `${PROCEDURES}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setProcedures', data.results)
        commit('setProcedureCount', data.count)
      })
      .catch(console.error)
  },
  fetchProcedureItems({ commit }, query) {
    let queryString = getProcedureQueryString(query)
    let URL = `${PROCEDURES}/items/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setProcedureItems', data.results)
      })
      .catch(console.error)
  },
  fetchMeasurementDefinitions({ commit }, query) {
    let queryString = getEventQueryString(query)
    let URL = `${MEASUREMENT_DEFINITIONS}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setMeasurementDefinitions', data.results)
      })
      .catch(console.error)
  },
  fetchEventItems({ commit }, query) {
    let queryString = getEventQueryString(query)
    let URL = `${EVENTS}/items/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setEventItems', data.results)
      })
      .catch(console.error)
  },
  fetchProcedureSteps({ commit }, query) {
    let queryString = getProcedureStepQueryString(query)
    let URL = `${PROCEDURE_STEPS}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setProcedureSteps', data.results)
        commit('setProcedureStepCount', data.count)
      })
      .catch(console.error)
  },
  fetchSubjects({ commit }, query) {
    let queryString = getSubjectQueryString(query)
    return session
      .get(`${SUBJECTS}/${queryString}`)
      .then(({ data }) => {
        commit('setSubjects', data.results)
        commit('setSubjectCount', data.count)
        return data.results
      })
      .catch(console.error)
  },
  fetchEvents({ commit }, query) {
    let queryString = getEventQueryString(query)
    return session
      .get(`${EVENTS}/${queryString}`)
      .then(({ data }) => {
        commit('setEvents', data.results)
        commit('setEventCount', data.count)
        return data.results
      })
      .catch(console.error)
  },
  fetchGroups({ commit }, { filters, options }) {
    let queryString = getGroupQueryString({ filters, options })
    return session
      .get(`${GROUPS}/${queryString}`)
      .then(({ data }) => {
        commit('setGroups', data.results)
        commit('setGroupCount', data.count)
      })
      .catch(console.error)
  },
  fetchGroupById({ commit }, groupId) {
    return session
      .get(`${GROUPS}/?id=${groupId}`)
      .then(({ data }) => data.results[0])
      .then(group => {
        commit('addGroup', group)
        return group
      })
      .catch(console.error)
  },
  createStudy({ commit }, study) {
    let URL = `${STUDIES}/`
    return session
      .post(URL, study)
      .then(({ data }) => {
        commit('addStudy', data)
        return data
      })
      .catch(console.error)
  },
  updateStudy({ commit }, study) {
    return session
      .patch(`${STUDIES}/${study.id}/`, study)
      .then(({ data }) => {
        commit('updateStudyState', data)
        return data
      })
      .catch(console.error)
  },
  patchStudy({ commit }, data) {
    let { id, ...dataWithoutId } = data
    return session
      .patch(`${STUDIES}/${id}/`, dataWithoutId)
      .then(({ data }) => {
        commit('updateStudyState', data)
        return data
      })
      .catch(console.error)
  },
  deleteStudy({ commit }, study) {
    return session
      .delete(`${STUDIES}/${study.id}/`)
      .then(() => commit('removeStudyFromState', study))
      .catch(console.error)
  },
  deleteGroup({ commit }, group) {
    return session
      .delete(`${GROUPS}/${group.id}/`)
      .then(() => commit('removeGroupFromState', group))
      .catch(console.error)
  },
  createProcedure({ commit }, procedure) {
    let URL = `${PROCEDURES}/`
    return session
      .post(URL, procedure)
      .then(({ data }) => {
        commit('addProcedure', data)
        return data
      })
      .catch(console.error)
  },
  createProcedureStep({ commit }, procedureStep) {
    let URL = `${PROCEDURE_STEPS}/`
    return session
      .post(URL, procedureStep)
      .then(({ data }) => {
        commit('addProcedureStep', data)
        return data
      })
      .catch(console.error)
  },
  patchProcedure({ commit }, data) {
    let { procedureId, ...dataWithoutId } = data
    let URL = `${PROCEDURES}/${procedureId}/`
    return session
      .patch(URL, dataWithoutId)
      .then(({ data }) => {
        commit('updateProcedureState', data)
        return true
      })
      .catch(console.error)
  },
  updateEvent({ commit }, data) {
    let URL = `${EVENTS}/${data.id}/`
    return session
      .patch(URL, data)
      .then(({ data }) => {
        commit('updateEventState', data)
      })
      .catch(console.error)
  },
  patchProcedureStep({ commit }, data) {
    let { procedureStepId, ...dataWithoutId } = data
    let URL = `${PROCEDURE_STEPS}/${procedureStepId}/`
    return session
      .patch(URL, dataWithoutId)
      .then(({ data }) => {
        commit('updateProcedureStepState', data)
        return true
      })
      .catch(console.error)
  },
  deleteProcedure({ commit }, procedure) {
    let URL = `${PROCEDURES}/${procedure.id}/`
    return session
      .delete(URL)
      .then(() => commit('removeProcedureFromState', procedure))
      .catch(console.error)
  },
  deleteProcedureStep({ commit }, procedureStep) {
    let URL = `${PROCEDURE_STEPS}/${procedureStep.id}/`
    return session
      .delete(URL)
      .then(() => commit('removeProcedureStepFromState', procedureStep))
      .catch(console.error)
  },
  deleteEvent({ commit }, event) {
    let URL = `${EVENTS}/${event.id}/`
    return session
      .delete(URL)
      .then(() => commit('removeEventFromState', event))
      .catch(console.error)
  },
  createGroup({ dispatch }, group) {
    return (
      session
        .post(GROUPS + '/', group)
        // Can't just add the returned value because GET
        // and POST return different JSONs (the POST result)
        // doesn't contain Study as an object but as a url
        .then(({ data }) => dispatch('fetchGroupById', data.id))
        .catch(console.error)
    )
  },
  createSubject({ commit }, subject) {
    return session
      .post(SUBJECTS + '/', subject)
      .then(({ data }) => {
        commit('addSubject', data)
        return data
      })
      .catch(console.error)
  },
  createEvent({ commit }, event) {
    let URL = `${EVENTS}/`
    return session
      .post(URL, event)
      .then(({ data }) => {
        commit('addEvent', data)
        return data
      })
      .catch(console.error)
  },
  updateSubject({ commit }, subject) {
    let URL = `${SUBJECTS}/${subject.id}/`
    return session
      .patch(URL, subject)
      .then(({ data }) => {
        commit('updateSubjectState', data)
        return data
      })
      .catch(console.error)
  },
  updateSubjectPartial({ commit }, data) {
    let { subjectId, ...dataWithoutId } = data
    let URL = `${SUBJECTS}/${subjectId}/`
    return session
      .patch(URL, dataWithoutId)
      .then(({ data }) => {
        commit('updateSubjectState', data)
        return data
      })
      .catch(console.error)
  },
  deleteSubject({ commit }, subject) {
    return session
      .delete(`${SUBJECTS}/${subject.id}/`)
      .then(() => commit('removeSubjectFromState', subject))
      .catch(console.error)
  },
  fetchSubjectsDateOfBirthPlot({ commit }) {
    return session
      .get(`${SUBJECTS}/plot/`)
      .then(({ data }) => commit('setSubjectDateOfBirthPlot', data))
      .catch(console.error)
  },
  fetchDataAcquisitionModels({ commit }, query) {
    let queryString = getDataAcquisitionQueryString(query)
    let URL = `${DATA_ACQUISITIONS}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setDataAcquisitionModels', data.results)
      })
      .catch(console.error)
  },
  exportSubjectData(undefined, data) {
    return session.post(EXPORT_SUBJECT_DATA, data).catch(console.error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
