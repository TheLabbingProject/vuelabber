import BASE from '@/api/base_url.js'

const ANALYSIS_BASE = `${BASE}/analyses`
const ANALYSES = `${ANALYSIS_BASE}/analysis`
const ANALYSIS_VERSIONS = `${ANALYSIS_BASE}/analysis_version`
const CATEGORIES = `${ANALYSIS_BASE}/category`
const INPUTS = `${ANALYSIS_BASE}/input`
const INPUT_DEFINITIONS = `${ANALYSIS_BASE}/input_definition`
const INPUT_SPECIFICATIONS = `${ANALYSIS_BASE}/input_specification`
const NODES = `${ANALYSIS_BASE}/node`
const OUTPUTS = `${ANALYSIS_BASE}/output`
const OUTPUT_DEFINITIONS = `${ANALYSIS_BASE}/output_definition`
const OUTPUT_SPECIFICATIONS = `${ANALYSIS_BASE}/output_specification`
const PIPES = `${ANALYSIS_BASE}/pipe`
const PIPELINES = `${ANALYSIS_BASE}/pipeline`
const RUNS = `${ANALYSIS_BASE}/run`

export {
  ANALYSES,
  ANALYSIS_VERSIONS,
  CATEGORIES,
  INPUTS,
  INPUT_DEFINITIONS,
  INPUT_SPECIFICATIONS,
  NODES,
  OUTPUTS,
  OUTPUT_DEFINITIONS,
  OUTPUT_SPECIFICATIONS,
  PIPES,
  PIPELINES,
  RUNS
}
