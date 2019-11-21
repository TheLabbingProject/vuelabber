import BASE from '@/api/base_url.js'

const ANALYSIS_BASE = `${BASE}/analysis/`
const ANALYSES = `${ANALYSIS_BASE}/analysis/`
const ANALYSIS_VERSIONS = `${ANALYSIS_BASE}/analysisVersion/`
const CATEGORIES = `${ANALYSIS_BASE}/category/`
const OUTPUTS = `${ANALYSIS_BASE}/output/`
const OUTPUT_DEFINITIONS = `${ANALYSIS_BASE}/outputDefinition/`
const OUTPUT_SPECIFICATIONS = `${ANALYSIS_BASE}/outputSpecification/`
const RUNS = `${ANALYSIS_BASE}/run/`
const INPUTS = `${ANALYSIS_BASE}/input/`
const INPUT_DEFINITIONS = `${ANALYSIS_BASE}/inputDefinition/`
const INPUT_SPECIFICATIONS = `${ANALYSIS_BASE}/inputSpecification/`

export {
  ANALYSES,
  ANALYSIS_VERSIONS,
  CATEGORIES,
  OUTPUTS,
  OUTPUT_DEFINITIONS,
  OUTPUT_SPECIFICATIONS,
  INPUTS,
  INPUT_DEFINITIONS,
  INPUT_SPECIFICATIONS,
  RUNS
}
