import { checkPhaseAndRedirect } from '$utils/ops';
export const prerender = false;
export const ssr = false;
const phase = 'ipo';
checkPhaseAndRedirect(phase);