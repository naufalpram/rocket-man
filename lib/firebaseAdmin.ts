import admin from 'firebase-admin';
import { RemoteConfigParameter } from 'firebase-admin/remote-config';

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_SA_KEY || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firebase Admin initialization error', error.message);
    } else {
      console.error('Firebase Admin initialization error', String(error));
    }
  }
}

const getRemoteConfig = async () => {
    try {
      const remoteConfig = admin.remoteConfig();
      const template = await remoteConfig.getTemplate();
      return template.parameters; // or the entire template if needed
    } catch (error) {
      console.error('Error fetching Remote Config:', error);
      return null;
    }
}

type RemoteConfigParameters =  {
    [key: string]: RemoteConfigParameter;
} | null

const getDefaultParamValue = (parameters: RemoteConfigParameters, key: string, fallbackValue: string) => {
    if (parameters) {
        const param = parameters?.[key];
        return param?.defaultValue && 'value' in param?.defaultValue ? param.defaultValue.value : fallbackValue;
    }
    return fallbackValue
}

export { admin, getRemoteConfig, getDefaultParamValue };
