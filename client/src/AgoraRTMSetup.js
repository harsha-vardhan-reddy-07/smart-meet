import { createClient } from 'agora-rtm-react';

const appId = "9018a94d10f34248aa03f0d14a011fb9";
const token = null;
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useRTMClient = createClient(appId);