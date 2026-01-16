// amplitude.ts
'use client';

import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    amplitude.add(sessionReplayPlugin({
        forceSessionTracking: true,
        sampleRate: 1
    }));
    amplitude.init('cd691afe1bca5ab691835fd287e85893', {"autocapture":true});
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;